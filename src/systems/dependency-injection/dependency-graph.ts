import { Graph, GraphNode } from "@/util/graphing.structures";
// import { getMetadata, hasMetadata, setMetadata } from "../../helpers";
import { Constructable } from "@/types/constructable.type";
// import { Logger } from "../logging";
// import { SYSTEM_LOGGER, SYSTEM_METADATA_NAME } from "./constants/system-info.constants";
// import { ProviderMetadata } from "./interfaces/provider-metadata.interface";
import { DependencyNode } from "./models/dependency-node.model";
import { ProviderModel } from "./models/provider.model";
import { DependencyTokenType } from "./types/dependency-token.type";
import { AbstractLogService } from "@logging";

export class DependencyGraph extends Graph<DependencyNode> {
  constructor(
    protected logger: AbstractLogService
  ) {
    super();
  }

  public addDependency(model: ProviderModel | Constructable<any>): ProviderModel {
    // Make sure what we have is a provider model
    model = this.getAsProviderModel(model);

    this.logger.debug(`Registering provider: ${model.instantiater.name}`);

    const classes = model.getClassDependencies();

    const asNode = new GraphNode(new DependencyNode(model.getToken(), model));
    this.addNode(asNode);

    classes.forEach((class_: any) => {
      this.logger.debug(`Registering class dependency: ${class_.name}`);
      const classAsNode = this.getOrCreateNodeByToken(class_.toString(), class_);
      this.addNode(classAsNode);
      asNode.addEdge(classAsNode);
    })
    return model;
  }

  public getOrCreateNodeByToken(token: DependencyTokenType, value: Constructable<any>): GraphNode {
    // Attempt to find one by token. If we can't find one, we'll create one
    for (let [key, value] of this.nodes.entries()) {
      if (key.symbol === token) {
        return value;
      }
    }
    // Couldn't find one. Let's make one instead
    return new GraphNode(new DependencyNode(token, null, value))
  }

  /**
   * Ensure that we have a provider model for a provider. If we're given a constructor
   * attempt to get the relevant info from metadata added to the constructor via decorator (WIP)
   * @param model A ProviderModel instance of a Constructor
   * @returns A ProviderModel representing the thing we provide
   */
  public getAsProviderModel(model: ProviderModel | Constructable<any>): ProviderModel {
    if (model instanceof ProviderModel) return model;

    // if (hasMetadata(model, SYSTEM_METADATA_NAME)) {
    //   // Currently not implemented
    //   const options = getMetadata<ProviderMetadata>(model, SYSTEM_METADATA_NAME);
    //   const newModel = new ProviderModel(model);
    //   setMetadata(newModel, SYSTEM_METADATA_NAME, options);

    //   return newModel;
    // } else {
    //   return new ProviderModel(model);
    // }

    return new ProviderModel(model);
  }
}