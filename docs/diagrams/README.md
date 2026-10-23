# Diagrams

Editable [Excalidraw](https://excalidraw.com) sources and their PNG exports for
the Pulse documentation.

| Diagram                                | Preview                                                | Source                                                               |
| -------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------- |
| System architecture                    | [system-architecture.png](system-architecture.png)     | [system-architecture.excalidraw](system-architecture.excalidraw)     |
| Notification request and delivery flow | [request-delivery-flow.png](request-delivery-flow.png) | [request-delivery-flow.excalidraw](request-delivery-flow.excalidraw) |
| Authentication and session flow        | [auth-session-flow.png](auth-session-flow.png)         | [auth-session-flow.excalidraw](auth-session-flow.excalidraw)         |
| Deployment topology                    | [deployment-topology.png](deployment-topology.png)     | [deployment-topology.excalidraw](deployment-topology.excalidraw)     |

The `.excalidraw` files are the editable sources. Open them at
<https://excalidraw.com> or with the Excalidraw editor in your IDE, then
re-export a PNG after changing the diagram.

## Regenerating the PNGs

With the `excalidraw-skill` installed, the local canvas can render the sources
headlessly. Start the canvas on an unused port, import a source, and export both
formats:

```bash
cd docs/diagrams
export EXPRESS_SERVER_URL=http://127.0.0.1:3033
PORT=3033 npx -y mcp-excalidraw-server start
npx -y mcp-excalidraw-server import system-architecture.excalidraw --replace
npx -y mcp-excalidraw-server screenshot --out system-architecture.png --scale 2
npx -y mcp-excalidraw-server export --out system-architecture.excalidraw
```

Use the same flow for the other diagrams. The canvas is only a local authoring
tool; the committed `.excalidraw` and `.png` files are the source of truth.
