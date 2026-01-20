import type { PrimitiveType } from '../../types';
import type * as THREE from 'three';
import { computeGeometryVolume, getGeometryBoundsSize } from '../../utils/geometryMeasurements';

interface SceneObjectData {
  id: string;
  type: PrimitiveType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

interface ObjectSidebarProps {
  selectedObjectIds: string[];
  objects: SceneObjectData[];
  selectedRenderMode: 'shaded' | 'mesh';
  objectVertexCounts: Record<string, number>;
  objectGeometries: Record<string, THREE.BufferGeometry>;
  unitScaleMm: number;
  measurePoints: Array<THREE.Vector3 | null>;
  onDeselectObject: () => void;
  onDeleteObject: (id: string) => void;
  onJoinSelected: () => void;
  onRenderModeChange: (mode: 'shaded' | 'mesh') => void;
  onObjectPositionChange: (id: string, position: [number, number, number]) => void;
  onObjectRotationChange: (id: string, rotation: [number, number, number]) => void;
  onObjectScaleChange: (id: string, scale: [number, number, number]) => void;
  onUnitScaleChange: (scale: number) => void;
  onClearMeasurements: () => void;
}

export function ObjectSidebar({
  selectedObjectIds,
  objects,
  selectedRenderMode,
  objectVertexCounts,
  objectGeometries,
  unitScaleMm,
  measurePoints,
  onDeselectObject,
  onDeleteObject,
  onJoinSelected,
  onRenderModeChange,
  onObjectPositionChange,
  onObjectRotationChange,
  onObjectScaleChange,
  onUnitScaleChange,
  onClearMeasurements,
}: ObjectSidebarProps) {
  const selectionCount = selectedObjectIds.length;
  const selectedObject = objects.find(obj => obj.id === selectedObjectIds[0]);
  const selectedGeometry = selectedObject ? objectGeometries[selectedObject.id] : undefined;

  if (selectionCount === 0) {
    return null;
  }

  const totalVertexCount = selectedObjectIds.reduce((acc, id) => acc + (objectVertexCounts[id] || 0), 0);
  const totalVolume = selectedObjectIds.reduce((acc, id) => {
    const geometry = objectGeometries[id];
    if (!geometry) return acc;
    const volume = Math.abs(computeGeometryVolume(geometry));
    return acc + volume;
  }, 0);

  const effectiveUnitScale = Number.isFinite(unitScaleMm) && unitScaleMm > 0 ? unitScaleMm : 1;
  const selectedVolume = selectedGeometry ? Math.abs(computeGeometryVolume(selectedGeometry)) : null;
  const selectedBounds = selectedGeometry ? getGeometryBoundsSize(selectedGeometry) : null;
  const [measureStart, measureEnd] = measurePoints;
  const measuredDistance = measureStart && measureEnd ? measureStart.distanceTo(measureEnd) : null;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      width: '250px',
      backgroundColor: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>Object Properties</h3>
        <button
          onClick={onDeselectObject}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0 5px',
          }}
          title="Deselect"
        >
          ×
        </button>
      </div>

      {/* Object Info */}
      <div style={{ marginBottom: '15px' }}>
        {selectionCount > 1 ? (
          <>
            <div style={{ marginBottom: '5px' }}>
              <strong>{selectionCount} objects selected</strong>
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>Total Vertices:</strong> {totalVertexCount.toLocaleString()}
            </div>
          </>
        ) : selectedObject && (
          <>
            <div style={{ marginBottom: '5px' }}>
              <strong>Type:</strong> {selectedObject.type}
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>ID:</strong> {selectedObject.id.substring(0, 8)}...
            </div>
            <div style={{ marginBottom: '5px' }}>
              <strong>Vertices:</strong> {(objectVertexCounts[selectedObject.id] || 0).toLocaleString()}
            </div>
          </>
        )}
      </div>

      {/* Render Mode */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          <strong>Render Mode:</strong>
        </label>
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => onRenderModeChange('shaded')}
            style={{
              flex: 1,
              padding: '5px',
              backgroundColor: selectedRenderMode === 'shaded' ? '#4a90e2' : '#2c2c2c',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Shaded
          </button>
          <button
            onClick={() => onRenderModeChange('mesh')}
            style={{
              flex: 1,
              padding: '5px',
              backgroundColor: selectedRenderMode === 'mesh' ? '#4a90e2' : '#2c2c2c',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
          >
            Wireframe
          </button>
        </div>
      </div>

      {/* Clinical Measurements */}
      <div style={{ marginBottom: '15px' }}>
        <strong>Clinical Measurements</strong>
        <div style={{ marginTop: '8px' }}>
          <label style={{ display: 'block', fontSize: '10px', color: '#aaa', marginBottom: '4px' }}>
            Unit Scale (mm per unit)
          </label>
          <input
            type="number"
            value={effectiveUnitScale}
            min="0.01"
            step="0.01"
            onChange={(e) => {
              const nextValue = parseFloat(e.target.value);
              onUnitScaleChange(Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 1);
            }}
            style={{
              width: '100%',
              padding: '4px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #333',
              color: 'white',
              borderRadius: '4px',
              fontSize: '11px',
              marginBottom: '8px',
            }}
          />
        </div>
        {selectionCount > 1 ? (
          <div style={{ fontSize: '11px' }}>
            <div><strong>Total Volume:</strong> {(totalVolume * Math.pow(effectiveUnitScale, 3)).toFixed(2)} mm³</div>
          </div>
        ) : selectedObject ? (
          <div style={{ fontSize: '11px', display: 'grid', gap: '6px' }}>
            <div>
              <strong>Volume:</strong>{' '}
              {selectedVolume === null ? 'N/A' : `${(selectedVolume * Math.pow(effectiveUnitScale, 3)).toFixed(2)} mm³`}
            </div>
            <div>
              <strong>Dimensions:</strong>{' '}
              {selectedBounds
                ? `${(selectedBounds.x * selectedObject.scale[0] * effectiveUnitScale).toFixed(2)} × ${(selectedBounds.y * selectedObject.scale[1] * effectiveUnitScale).toFixed(2)} × ${(selectedBounds.z * selectedObject.scale[2] * effectiveUnitScale).toFixed(2)} mm`
                : 'N/A'}
            </div>
            <div>
              <strong>Angles:</strong>{' '}
              {`${(selectedObject.rotation[0] * 180 / Math.PI).toFixed(1)}°, ${(selectedObject.rotation[1] * 180 / Math.PI).toFixed(1)}°, ${(selectedObject.rotation[2] * 180 / Math.PI).toFixed(1)}°`}
            </div>
          </div>
        ) : null}
        <div style={{ marginTop: '10px', fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Point Distance:</strong>
            <button
              onClick={onClearMeasurements}
              style={{
                backgroundColor: '#2c2c2c',
                border: 'none',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                padding: '2px 6px',
                fontSize: '10px',
              }}
            >
              Clear
            </button>
          </div>
          <div>
            {measuredDistance === null
              ? 'Click two points to measure'
              : `${(measuredDistance * effectiveUnitScale).toFixed(2)} mm`}
          </div>
        </div>
      </div>

      {/* Transform Controls (only for single selection) */}
      {selectionCount === 1 && selectedObject && (
        <>
          {/* Position Controls */}
          <div style={{ marginBottom: '15px' }}>
            <strong>Position:</strong>
            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
              {['X', 'Y', 'Z'].map((axis, index) => (
                <div key={axis} style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', color: '#aaa' }}>{axis}</label>
                  <input
                    type="number"
                    value={selectedObject.position[index].toFixed(2)}
                    step="0.1"
                    onChange={(e) => {
                      const newPos = [...selectedObject.position] as [number, number, number];
                      newPos[index] = parseFloat(e.target.value) || 0;
                      onObjectPositionChange(selectedObject.id, newPos);
                    }}
                    style={{
                      width: '100%',
                      padding: '2px',
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      color: 'white',
                      borderRadius: '2px',
                      fontSize: '11px',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rotation Controls */}
          <div style={{ marginBottom: '15px' }}>
            <strong>Rotation:</strong>
            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
              {['X', 'Y', 'Z'].map((axis, index) => (
                <div key={axis} style={{ flex: 1 }}>
                  <label style={{ fontSize: '10px', color: '#aaa' }}>{axis}°</label>
                  <input
                    type="number"
                    value={(selectedObject.rotation[index] * 180 / Math.PI).toFixed(0)}
                    step="5"
                    onChange={(e) => {
                      const newRot = [...selectedObject.rotation] as [number, number, number];
                      newRot[index] = (parseFloat(e.target.value) || 0) * Math.PI / 180;
                      onObjectRotationChange(selectedObject.id, newRot);
                    }}
                    style={{
                      width: '100%',
                      padding: '2px',
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #333',
                      color: 'white',
                      borderRadius: '2px',
                      fontSize: '11px',
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Scale Controls */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              <strong>Scale:</strong> {selectedObject.scale[0].toFixed(2)}
            </label>
            <input
              type="range"
              min="0.1"
              max="5"
              step="0.1"
              value={selectedObject.scale[0]}
              onChange={(e) => {
                const newScale = parseFloat(e.target.value);
                onObjectScaleChange(selectedObject.id, [newScale, newScale, newScale]);
              }}
              style={{ width: '100%' }}
            />
          </div>
        </>
      )}

      {/* Actions */}
      <div>
        {selectionCount === 2 && (
          <button
            onClick={onJoinSelected}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#455a64',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              marginBottom: '8px',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#546e7a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#455a64'}
          >
            Boolean Join
          </button>
        )}
        <button
          onClick={() => selectedObjectIds.forEach(id => onDeleteObject(id))}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: '#d32f2f',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f44336'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#d32f2f'}
        >
          Delete {selectionCount > 1 ? `${selectionCount} Objects` : 'Object'}
        </button>
      </div>
    </div>
  );
}
