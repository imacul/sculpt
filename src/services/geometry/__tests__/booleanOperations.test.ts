import { describe, it, expect } from 'vitest';
import * as THREE from 'three';
import { BooleanOperations } from '../booleanOperations';

describe('BooleanOperations', () => {
  describe('join', () => {
    it('should return a single geometry when two geometries are joined', () => {
      const geometry1 = new THREE.BoxGeometry(1, 1, 1);
      const geometry2 = new THREE.BoxGeometry(1, 1, 1);
      geometry2.translate(0.5, 0.5, 0.5);

      const result = BooleanOperations.join(geometry1, geometry2);

      // Looser check for BufferGeometry due to potential instance mismatches
      // in test environments.
      expect(result).toHaveProperty('attributes');
      expect(result).toHaveProperty('drawRange');
      expect(result?.attributes.position).toBeDefined();
    });

    it('should return null if one of the geometries is missing', () => {
      const geometry1 = new THREE.BoxGeometry(1, 1, 1);

      const result = BooleanOperations.join(geometry1, null);

      expect(result).toBeNull();
    });

    it('should not crash if geometries are missing UVs', () => {
      // 1. Create geometries that are known to not have UVs
      const geometry1 = new THREE.BoxGeometry(1, 1, 1);
      const geometry2 = new THREE.BoxGeometry(1, 1, 1);
      geometry2.translate(0.5, 0.5, 0.5);

      // 2. Explicitly remove the UV attribute to simulate an imported model
      geometry1.deleteAttribute('uv');
      geometry2.deleteAttribute('uv');

      // 3. Perform the join operation
      const result = BooleanOperations.join(geometry1, geometry2);

      // 4. Assert that the operation completed successfully and returned a valid geometry
      expect(result).not.toBeNull();
      // Use a looser check for BufferGeometry to avoid instanceof issues in test environments
      expect(result).toHaveProperty('attributes');
      expect(result).toHaveProperty('drawRange');

      // 5. Assert that the resulting geometry now has UVs
      expect(result?.attributes.uv).toBeDefined();
    });
  });
});
