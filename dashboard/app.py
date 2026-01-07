"""
Pulse Observability Dashboard
Real-time metrics for notification system monitoring.
"""

import os
from datetime import datetime, timedelta

import matplotlib.pyplot as plt
import pandas as pd
import redis
import streamlit as st
from sqlalchemy import create_engine, text

# =============================================================================
# Configuration
# =============================================================================

st.set_page_config(
    page_title="Pulse Dashboard",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom CSS for a polished dark theme
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;600;700&display=swap');
    
    :root {
        --bg-primary: #0f0f0f;
        --bg-secondary: #1a1a1a;
        --bg-card: #232323;
        --accent-cyan: #00d4ff;
        --accent-green: #00ff88;
        --accent-red: #ff4757;
        --accent-yellow: #ffd93d;
        --accent-purple: #a855f7;
        --text-primary: #ffffff;
        --text-secondary: #888888;
    }
    
    .stApp {
        background: linear-gradient(135deg, var(--bg-primary) 0%, #1a1a2e 100%);
    }
    
    .main-header {
        font-family: 'Outfit', sans-serif;
        font-size: 2.8rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--accent-cyan), var(--accent-purple));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
    }
    
    .sub-header {
        font-family: 'Outfit', sans-serif;
        color: var(--text-secondary);
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }
    
    .metric-card {
        background: var(--bg-card);
        border-radius: 16px;
        padding: 1.5rem;
        border: 1px solid rgba(255,255,255,0.05);
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    
    .metric-value {
        font-family: 'JetBrains Mono', monospace;
        font-size: 2.5rem;
        font-weight: 700;
        color: var(--accent-cyan);
    }
    
    .metric-label {
        font-family: 'Outfit', sans-serif;
        color: var(--text-secondary);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    
    .section-header {
        font-family: 'Outfit', sans-serif;
        font-size: 1.4rem;
        font-weight: 600;
        color: var(--text-primary);
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding-bottom: 0.5rem;
        border-bottom: 2px solid var(--accent-cyan);
    }
    
    .status-sent { color: var(--accent-green); }
    .status-failed { color: var(--accent-red); }
    .status-retrying { color: var(--accent-yellow); }
    .status-pending { color: var(--accent-cyan); }
    
    /* Hide Streamlit branding */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    
    /* Style dataframes */
    .stDataFrame {
        background: var(--bg-card);
        border-radius: 12px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# =============================================================================
# Database & Redis Connections
# =============================================================================


@st.cache_resource
def get_db_engine():
    """Create SQLAlchemy engine for PostgreSQL."""
    db_url = os.environ.get(
        "DATABASE_URL", "postgresql://postgres:postgres@db:5432/pulse"
    )
    # Convert postgres:// to postgresql:// for SQLAlchemy 2.0
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    return create_engine(db_url)


@st.cache_resource
def get_redis_client():
    """Create Redis client connection."""
    redis_url = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
    return redis.from_url(redis_url)


# =============================================================================
# Data Fetching Functions
# =============================================================================


def get_queue_lengths(r: redis.Redis) -> dict:
    """Get current Celery queue lengths from Redis."""
    queues = ["high_priority", "low_priority", "celery"]
    lengths = {}
    for queue in queues:
        # Celery uses different key patterns
        key = queue
        try:
            length = r.llen(key)
            lengths[queue] = length
        except Exception:
            lengths[queue] = 0
    return lengths


def get_notification_stats(engine, hours: int = 24) -> pd.DataFrame:
    """Get notification counts by status and channel."""
    query = text(
        """
        SELECT status, channel, COUNT(*) as count
        FROM notifications_notificationlog
        WHERE created_at > NOW() - INTERVAL ':hours HOURS'
        GROUP BY status, channel
        ORDER BY channel, status
    """.replace(":hours", str(hours))
    )
    try:
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
        return df
    except Exception as e:
        st.error(f"Database error: {e}")
        return pd.DataFrame()


def get_hourly_trends(engine, hours: int = 24) -> pd.DataFrame:
    """Get hourly notification trends."""
    query = text(
        """
        SELECT 
            DATE_TRUNC('hour', created_at) as hour,
            status,
            COUNT(*) as count
        FROM notifications_notificationlog
        WHERE created_at > NOW() - INTERVAL ':hours HOURS'
        GROUP BY DATE_TRUNC('hour', created_at), status
        ORDER BY hour
    """.replace(":hours", str(hours))
    )
    try:
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
        return df
    except Exception:
        return pd.DataFrame()


def get_retry_stats(engine, hours: int = 24) -> pd.DataFrame:
    """Get retry attempt statistics."""
    query = text(
        """
        SELECT 
            DATE_TRUNC('hour', created_at) as hour,
            AVG(attempts) as avg_attempts,
            MAX(attempts) as max_attempts,
            COUNT(*) FILTER (WHERE status = 'retrying') as retrying_count
        FROM notifications_notificationlog
        WHERE created_at > NOW() - INTERVAL ':hours HOURS'
        GROUP BY DATE_TRUNC('hour', created_at)
        ORDER BY hour
    """.replace(":hours", str(hours))
    )
    try:
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
        return df
    except Exception:
        return pd.DataFrame()


def get_failure_rates(engine, days: int = 7) -> pd.DataFrame:
    """Get failure rates by channel."""
    query = text(
        """
        SELECT 
            channel,
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'failed') as failed,
            COUNT(*) FILTER (WHERE status = 'sent') as sent,
            ROUND(
                COUNT(*) FILTER (WHERE status = 'failed') * 100.0 / NULLIF(COUNT(*), 0), 2
            ) as fail_rate
        FROM notifications_notificationlog
        WHERE created_at > NOW() - INTERVAL ':days DAYS'
        GROUP BY channel
        ORDER BY total DESC
    """.replace(":days", str(days))
    )
    try:
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
        return df
    except Exception:
        return pd.DataFrame()


def get_summary_metrics(engine) -> dict:
    """Get overall summary metrics."""
    query = text(
        """
        SELECT 
            COUNT(*) as total,
            COUNT(*) FILTER (WHERE status = 'sent') as sent,
            COUNT(*) FILTER (WHERE status = 'failed') as failed,
            COUNT(*) FILTER (WHERE status = 'retrying') as retrying,
            COUNT(*) FILTER (WHERE status = 'pending') as pending,
            COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '24 HOURS') as last_24h
        FROM notifications_notificationlog
    """
    )
    try:
        with engine.connect() as conn:
            result = conn.execute(query).fetchone()
        return {
            "total": result[0] or 0,
            "sent": result[1] or 0,
            "failed": result[2] or 0,
            "retrying": result[3] or 0,
            "pending": result[4] or 0,
            "last_24h": result[5] or 0,
        }
    except Exception:
        return {
            "total": 0,
            "sent": 0,
            "failed": 0,
            "retrying": 0,
            "pending": 0,
            "last_24h": 0,
        }


def get_recent_notifications(engine, limit: int = 10) -> pd.DataFrame:
    """Get recent notifications."""
    query = text(
        f"""
        SELECT 
            id,
            channel,
            "to" as recipient,
            status,
            attempts,
            created_at,
            error_message
        FROM notifications_notificationlog
        ORDER BY created_at DESC
        LIMIT {limit}
    """
    )
    try:
        with engine.connect() as conn:
            df = pd.read_sql(query, conn)
        return df
    except Exception:
        return pd.DataFrame()


# =============================================================================
# Dashboard UI
# =============================================================================


def main():
    # Header
    st.markdown(
        '<h1 class="main-header">⚡ Pulse Dashboard</h1>', unsafe_allow_html=True
    )
    st.markdown(
        '<p class="sub-header">Real-time observability for your notification system</p>',
        unsafe_allow_html=True,
    )

    # Initialize connections
    try:
        engine = get_db_engine()
        r = get_redis_client()
    except Exception as e:
        st.error(f"Connection error: {e}")
        return

    # Sidebar
    with st.sidebar:
        st.markdown("### ⚙️ Settings")
        auto_refresh = st.checkbox("Auto-refresh (30s)", value=False)
        time_range = st.selectbox(
            "Time Range",
            options=[6, 12, 24, 48, 72],
            index=2,
            format_func=lambda x: f"Last {x} hours",
        )

        st.markdown("---")
        st.markdown("### 🔗 Quick Links")
        st.markdown("- [Flower Monitor](http://localhost:5555)")
        st.markdown("- [API Docs](http://localhost:8000/api/docs/)")
        st.markdown("- [ReDoc](http://localhost:8000/api/redoc/)")

        st.markdown("---")
        st.markdown("### 📊 Prometheus")
        st.markdown("Metrics available at:")
        st.code("http://localhost:8001/metrics")

        if st.button("🔄 Refresh Now"):
            st.cache_data.clear()
            st.rerun()

    if auto_refresh:
        st.markdown(
            """
            <meta http-equiv="refresh" content="30">
            """,
            unsafe_allow_html=True,
        )

    # Summary Metrics Row
    st.markdown('<div class="section-header">📈 Overview</div>', unsafe_allow_html=True)
    metrics = get_summary_metrics(engine)
    queue_lengths = get_queue_lengths(r)

    col1, col2, col3, col4, col5, col6 = st.columns(6)

    with col1:
        st.metric(
            label="Total Notifications",
            value=f"{metrics['total']:,}",
            delta=f"+{metrics['last_24h']} (24h)",
        )
    with col2:
        st.metric(
            label="✅ Sent",
            value=f"{metrics['sent']:,}",
            delta=f"{metrics['sent'] * 100 // max(metrics['total'], 1)}%",
        )
    with col3:
        st.metric(
            label="❌ Failed",
            value=f"{metrics['failed']:,}",
            delta=f"{metrics['failed'] * 100 // max(metrics['total'], 1)}%",
            delta_color="inverse",
        )
    with col4:
        st.metric(label="🔄 Retrying", value=f"{metrics['retrying']:,}")
    with col5:
        st.metric(label="⏳ Pending", value=f"{metrics['pending']:,}")
    with col6:
        total_queued = sum(queue_lengths.values())
        st.metric(label="📬 Queue Length", value=f"{total_queued:,}")

    # Queue Lengths
    st.markdown(
        '<div class="section-header">📬 Queue Status</div>', unsafe_allow_html=True
    )
    col1, col2 = st.columns([2, 3])

    with col1:
        queue_df = pd.DataFrame(
            {"Queue": queue_lengths.keys(), "Length": queue_lengths.values()}
        )
        st.dataframe(queue_df, hide_index=True, use_container_width=True)

    with col2:
        if any(queue_lengths.values()):
            fig, ax = plt.subplots(figsize=(8, 3), facecolor="#1a1a1a")
            ax.set_facecolor("#1a1a1a")
            colors = ["#00d4ff", "#00ff88", "#a855f7"]
            bars = ax.barh(
                list(queue_lengths.keys()), list(queue_lengths.values()), color=colors
            )
            ax.set_xlabel("Jobs in Queue", color="#888888")
            ax.tick_params(colors="#888888")
            for spine in ax.spines.values():
                spine.set_color("#333333")
            plt.tight_layout()
            st.pyplot(fig)
        else:
            st.info("🎉 All queues empty!")

    # Notification Stats by Channel
    st.markdown(
        '<div class="section-header">📊 Notifications by Channel (Last {0}h)</div>'.format(
            time_range
        ),
        unsafe_allow_html=True,
    )

    stats_df = get_notification_stats(engine, hours=time_range)
    if not stats_df.empty:
        col1, col2 = st.columns([1, 1])

        with col1:
            pivot_df = stats_df.pivot(
                index="channel", columns="status", values="count"
            ).fillna(0)
            st.dataframe(pivot_df, use_container_width=True)

        with col2:
            fig, ax = plt.subplots(figsize=(8, 4), facecolor="#1a1a1a")
            ax.set_facecolor("#1a1a1a")
            status_colors = {
                "sent": "#00ff88",
                "failed": "#ff4757",
                "retrying": "#ffd93d",
                "pending": "#00d4ff",
            }
            pivot_df.plot(
                kind="bar",
                ax=ax,
                color=[status_colors.get(c, "#888888") for c in pivot_df.columns],
            )
            ax.set_xlabel("Channel", color="#888888")
            ax.set_ylabel("Count", color="#888888")
            ax.tick_params(colors="#888888")
            ax.legend(facecolor="#1a1a1a", labelcolor="#888888")
            for spine in ax.spines.values():
                spine.set_color("#333333")
            plt.xticks(rotation=45)
            plt.tight_layout()
            st.pyplot(fig)
    else:
        st.info("📭 No notifications in the selected time range")

    # Hourly Trends
    st.markdown(
        '<div class="section-header">📈 Hourly Trends</div>', unsafe_allow_html=True
    )

    trends_df = get_hourly_trends(engine, hours=time_range)
    if not trends_df.empty:
        fig, ax = plt.subplots(figsize=(12, 4), facecolor="#1a1a1a")
        ax.set_facecolor("#1a1a1a")

        pivot_trends = trends_df.pivot(
            index="hour", columns="status", values="count"
        ).fillna(0)

        status_colors = {
            "sent": "#00ff88",
            "failed": "#ff4757",
            "retrying": "#ffd93d",
            "pending": "#00d4ff",
        }

        for status in pivot_trends.columns:
            ax.plot(
                pivot_trends.index,
                pivot_trends[status],
                label=status,
                color=status_colors.get(status, "#888888"),
                linewidth=2,
                marker="o",
                markersize=4,
            )

        ax.set_xlabel("Hour", color="#888888")
        ax.set_ylabel("Count", color="#888888")
        ax.tick_params(colors="#888888")
        ax.legend(facecolor="#1a1a1a", labelcolor="#888888")
        for spine in ax.spines.values():
            spine.set_color("#333333")
        ax.grid(True, alpha=0.2)
        plt.xticks(rotation=45)
        plt.tight_layout()
        st.pyplot(fig)
    else:
        st.info("📭 No trend data available")

    # Failure Rates
    st.markdown(
        '<div class="section-header">⚠️ Failure Rates by Channel (7 days)</div>',
        unsafe_allow_html=True,
    )

    fail_df = get_failure_rates(engine, days=7)
    if not fail_df.empty:
        col1, col2 = st.columns([1, 1])

        with col1:
            st.dataframe(fail_df, hide_index=True, use_container_width=True)

        with col2:
            fig, ax = plt.subplots(figsize=(8, 4), facecolor="#1a1a1a")
            ax.set_facecolor("#1a1a1a")

            colors = [
                "#ff4757" if rate > 10 else "#ffd93d" if rate > 5 else "#00ff88"
                for rate in fail_df["fail_rate"].fillna(0)
            ]

            bars = ax.bar(
                fail_df["channel"], fail_df["fail_rate"].fillna(0), color=colors
            )
            ax.set_xlabel("Channel", color="#888888")
            ax.set_ylabel("Failure Rate (%)", color="#888888")
            ax.tick_params(colors="#888888")
            ax.axhline(
                y=5, color="#ffd93d", linestyle="--", alpha=0.5, label="Warning (5%)"
            )
            ax.axhline(
                y=10, color="#ff4757", linestyle="--", alpha=0.5, label="Critical (10%)"
            )
            ax.legend(facecolor="#1a1a1a", labelcolor="#888888")
            for spine in ax.spines.values():
                spine.set_color("#333333")
            plt.tight_layout()
            st.pyplot(fig)
    else:
        st.info("📭 No failure data available")

    # Retry Stats
    st.markdown(
        '<div class="section-header">🔄 Retry Analysis</div>', unsafe_allow_html=True
    )

    retry_df = get_retry_stats(engine, hours=time_range)
    if not retry_df.empty and "avg_attempts" in retry_df.columns:
        col1, col2 = st.columns([1, 1])

        with col1:
            avg_attempts = retry_df["avg_attempts"].mean()
            max_attempts = retry_df["max_attempts"].max()
            total_retrying = retry_df["retrying_count"].sum()

            st.metric("Average Attempts", f"{avg_attempts:.2f}")
            st.metric("Max Attempts", f"{max_attempts:.0f}")
            st.metric("Currently Retrying", f"{total_retrying:.0f}")

        with col2:
            fig, ax = plt.subplots(figsize=(8, 4), facecolor="#1a1a1a")
            ax.set_facecolor("#1a1a1a")
            ax.plot(
                retry_df["hour"],
                retry_df["avg_attempts"],
                color="#ffd93d",
                linewidth=2,
                marker="o",
            )
            ax.fill_between(
                retry_df["hour"], retry_df["avg_attempts"], alpha=0.3, color="#ffd93d"
            )
            ax.set_xlabel("Hour", color="#888888")
            ax.set_ylabel("Avg Attempts", color="#888888")
            ax.tick_params(colors="#888888")
            for spine in ax.spines.values():
                spine.set_color("#333333")
            plt.xticks(rotation=45)
            plt.tight_layout()
            st.pyplot(fig)
    else:
        st.info("📭 No retry data available")

    # Recent Notifications
    st.markdown(
        '<div class="section-header">📋 Recent Notifications</div>',
        unsafe_allow_html=True,
    )

    recent_df = get_recent_notifications(engine, limit=15)
    if not recent_df.empty:
        # Format the dataframe for display
        recent_df["id"] = recent_df["id"].astype(str).str[:8] + "..."
        recent_df["created_at"] = pd.to_datetime(recent_df["created_at"]).dt.strftime(
            "%Y-%m-%d %H:%M"
        )
        if "error_message" in recent_df.columns:
            recent_df["error_message"] = recent_df["error_message"].fillna("").str[:50]

        st.dataframe(recent_df, hide_index=True, use_container_width=True)
    else:
        st.info("📭 No notifications yet - send some to see them here!")

    # Footer
    st.markdown("---")
    st.markdown(
        f"""
        <div style="text-align: center; color: #888888; font-size: 0.8rem;">
            Pulse Dashboard • Last updated: {datetime.now().strftime("%Y-%m-%d %H:%M:%S")} • 
            <a href="http://localhost:5555" style="color: #00d4ff;">Flower</a> •
            <a href="http://localhost:8000/api/docs/" style="color: #00d4ff;">API Docs</a>
        </div>
        """,
        unsafe_allow_html=True,
    )


if __name__ == "__main__":
    main()
