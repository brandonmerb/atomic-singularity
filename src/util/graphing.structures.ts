/**
 * A simple Graph implementation, capable of handling different value types
 * and providing basic data agnostic graph functions.
 * TODO: This can probably be optimized. At a minimum implementing the 
 * iterator symbol could be worthwhile to provide the ability to perform
 * transforms like .map, etc.
 */
export class Graph<ValueType, NodeType extends GraphNode = GraphNode<ValueType>> {
  /**
   * A map that stores values and the node they map to. This is
   * largely used for fast look ups of nodes by value
   */
  public nodes: Map<ValueType, NodeType> = new Map();

  public addNode(node: NodeType) {
    this.nodes.set(node.data, node);
  }

  public removeNode(node: NodeType) {
    // Remove this from our map
    this.nodes.delete(node.data);

    // Crawl through all other nodes and remove
    // any edges connected to this node
    for (let node of this.nodes.values()) {
      // This implementation will check each node
      // to see if an edge exists, and remove it
      // if it does. It will not error if it does
      // not have an edge.
      node.removeEdge(node);
    }
  }

  public addEdge(fromNode: NodeType, toNode: NodeType) {
    fromNode.addEdge(toNode);
  }

  public removeEdge(fromNode: NodeType, toNode: NodeType) {
    fromNode.removeEdge(toNode);
  }

  /**
   * Find a node that has matching data
   * @param dataType 
   * @param searchType Which type of search to use. Defaults to Breadth First Search (bfs),
   * but you can optionally use Depth First Search (dfs) instead
   */
  /*public findNodeByData(data: ValueType, searchType: 'bfs' | 'dfs' = 'bfs') {
    if (searchType === "bfs") {
      return this.breadthFirstFind(data);
    } else {
      return this.depthFirstFind(data);
    }
  }

  protected breadthFirstFind(dataType: ValueType): NodeType | null {
    return null;
  }

  protected depthFirstFind(dataType: ValueType): NodeType | null {
    return null;
  }*/
}

export class GraphNode<ValueType = any> {
  // TODO: This could probably be implemented in faster way via
  //       something like a hashmap
  public edges: GraphNode<ValueType>[] = [];

  constructor(public data?: ValueType){}

  public addEdge(node: GraphNode<ValueType>): void {
    this.edges.push(node);
  }

  public removeEdge(node: GraphNode<ValueType>, errorIfNoEdge = false): void {
    const index = this.edges.findIndex(x => x === node);
    if (errorIfNoEdge && index < 0) {
      throw Error("Attempted to remove an edge that doesn't exist.");
    } else if (index < 0) {
      return;
    }
    this.edges.splice(index, 1);
  }

  public hasEdge(node: GraphNode<ValueType>): GraphNode<ValueType> | (null | undefined) {
    return this.edges.find(x => x === node);
  }

  public hasEdges(): boolean {
    return this.edges.length > 0;
  }

  public setData(newData: ValueType) {
    this.data = newData;
  }
}