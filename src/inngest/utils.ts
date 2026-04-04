import toposort from "toposort";
import { Connection, Node } from "@/generated/prisma/client";

export const topologicalSort = (nodes: Node[], connections: Connection[]) => {
  // if no connections return as is
  if (connections.length === 0) {
    return nodes;
  }

  // create edges array for toposort

  const edges: [string, string][] = connections.map((connection) => [
    connection.fromNodeId,
    connection.toNodeId,
  ]);

  // add nodes with no connections as self-edges to ensure they are included

  const connectedNodeIds = new Set<string>();
  for (const connection of connections) {
    connectedNodeIds.add(connection.fromNodeId);
    connectedNodeIds.add(connection.toNodeId);
  }

  for (const node of nodes) {
    if (!connectedNodeIds.has(node.id)) {
      edges.push([node.id, node.id]);
    }
  }

  // perform topological sort

  let sortedNodeIds: string[];
  try {
    sortedNodeIds = toposort(edges);

    // remove duplicates from selfe edges
    sortedNodeIds = [...new Set(sortedNodeIds)];
  } catch (error) {
    if (error instanceof Error && error.message.includes("Cyclic")) {
      throw new Error("Workflow contains a cylce");
    }
    throw error;
  }

  // map sorted ID' bakc to node object

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  return sortedNodeIds.map((id) => nodeMap.get(id)!).filter(Boolean);
};
