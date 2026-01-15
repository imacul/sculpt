import * as THREE from 'three';
import { Brush, Evaluator, ADDITION } from 'three-bvh-csg';
import { MeshBVH } from 'three-mesh-bvh';
import { ensureUVs } from './uvGenerator';

// It's recommended to add a 'boundsTree' to complex geometries for performance.
// This function ensures the geometry has a BVH.
const ensureBVH = (geometry: THREE.BufferGeometry) => {
  if (!geometry.boundsTree) {
    geometry.boundsTree = new MeshBVH(geometry);
  }
};

export class BooleanOperations {
  /**
   * Joins two geometries together using a boolean union operation.
   * @param geometry1 The first geometry.
   * @param geometry2 The second geometry.
   * @returns A new BufferGeometry representing the union of the two inputs.
   */
  public static join(
    geometry1: THREE.BufferGeometry | null,
    geometry2: THREE.BufferGeometry | null
  ): THREE.BufferGeometry | null {
    if (!geometry1 || !geometry2) {
      return null;
    }

    // Ensure both geometries have UVs and BVH for CSG and performance
    ensureUVs(geometry1);
    ensureBVH(geometry1);
    ensureUVs(geometry2);
    ensureBVH(geometry2);

    // Create brushes from the geometries
    const brushA = new Brush(geometry1);
    const brushB = new Brush(geometry2);

    // Evaluate the union operation
    const evaluator = new Evaluator();
    const resultBrush = evaluator.evaluate(brushA, brushB, ADDITION);

    // The result of the evaluation is a new BufferGeometry
    const resultGeometry = resultBrush.geometry;

    // Clean up the result geometry
    resultGeometry.clearGroups();

    return resultGeometry;
  }
}
