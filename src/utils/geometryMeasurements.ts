import * as THREE from 'three';

export function computeGeometryVolume(geometry: THREE.BufferGeometry): number {
  const position = geometry.getAttribute('position');
  const index = geometry.getIndex();

  if (!position) {
    return 0;
  }

  const positions = position.array as Float32Array;
  const indices = index ? Array.from(index.array) : null;
  let volume = 0;

  const triangleCount = indices ? indices.length / 3 : position.count / 3;

  for (let i = 0; i < triangleCount; i++) {
    const i0 = indices ? indices[i * 3] : i * 3;
    const i1 = indices ? indices[i * 3 + 1] : i * 3 + 1;
    const i2 = indices ? indices[i * 3 + 2] : i * 3 + 2;

    const v0 = new THREE.Vector3(
      positions[i0 * 3],
      positions[i0 * 3 + 1],
      positions[i0 * 3 + 2]
    );
    const v1 = new THREE.Vector3(
      positions[i1 * 3],
      positions[i1 * 3 + 1],
      positions[i1 * 3 + 2]
    );
    const v2 = new THREE.Vector3(
      positions[i2 * 3],
      positions[i2 * 3 + 1],
      positions[i2 * 3 + 2]
    );

    volume += v0.dot(v1.clone().cross(v2));
  }

  return volume / 6;
}

export function getGeometryBoundsSize(geometry: THREE.BufferGeometry): THREE.Vector3 {
  geometry.computeBoundingBox();
  const bounds = geometry.boundingBox;

  if (!bounds) {
    return new THREE.Vector3(0, 0, 0);
  }

  const size = new THREE.Vector3();
  bounds.getSize(size);
  return size;
}
