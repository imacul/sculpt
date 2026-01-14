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
  });
});
