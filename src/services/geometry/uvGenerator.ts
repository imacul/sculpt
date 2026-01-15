import * as THREE from 'three';

/**
 * Ensures that a BufferGeometry has UV coordinates. If they are missing, it generates them
 * using a simple spherical projection. This is often necessary for CSG operations, which
 * may require UVs to function correctly.
 *
 * @param geometry The THREE.BufferGeometry to check and potentially add UVs to.
 */
export const ensureUVs = (geometry: THREE.BufferGeometry): void => {
  // If UVs already exist, do nothing.
  if (geometry.attributes.uv) {
    return;
  }

  // Get the position attribute of the geometry.
  const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
  if (!positionAttribute) {
    // Cannot generate UVs without position data.
    return;
  }

  const vertexCount = positionAttribute.count;
  const uvs = new Float32Array(vertexCount * 2);
  const position = new THREE.Vector3();

  // Iterate over each vertex to calculate its UV coordinate.
  for (let i = 0; i < vertexCount; i++) {
    position.fromBufferAttribute(positionAttribute, i);

    // Normalize the position vector to get a point on the unit sphere.
    position.normalize();

    // Spherical projection:
    // u = 0.5 + atan2(z, x) / (2 * PI)
    // v = 0.5 - asin(y) / PI
    const u = 0.5 + Math.atan2(position.z, position.x) / (2 * Math.PI);
    const v = 0.5 - Math.asin(position.y) / Math.PI;

    uvs[i * 2] = u;
    uvs[i * 2 + 1] = v;
  }

  // Add the new UV attribute to the geometry.
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
};
