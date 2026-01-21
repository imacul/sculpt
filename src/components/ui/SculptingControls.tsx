import type { ToolType } from '../../types';
import { getToolDefinition } from '../../services/tools/toolDefinitions';

interface SculptingControlsProps {
  currentTool: ToolType;
  brushSize: number;
  brushStrength: number;
  offsetDepthMm: number;
  extrudeDepthMm: number;
  unitScaleMm: number;
  selectedObjectIds: string[];
  symmetryAxes: { x: boolean; y: boolean; z: boolean };
  onBrushSizeChange: (size: number) => void;
  onBrushStrengthChange: (strength: number) => void;
  onOffsetDepthChange: (depth: number) => void;
  onExtrudeDepthChange: (depth: number) => void;
  onSymmetryChange: (axis: 'x' | 'y' | 'z', enabled: boolean) => void;
}

export function SculptingControls({
  currentTool,
  brushSize,
  brushStrength,
  offsetDepthMm,
  extrudeDepthMm,
  unitScaleMm,
  selectedObjectIds,
  symmetryAxes,
  onBrushSizeChange,
  onBrushStrengthChange,
  onOffsetDepthChange,
  onExtrudeDepthChange,
  onSymmetryChange,
}: SculptingControlsProps) {
  const toolDef = getToolDefinition(currentTool);
  const selectionCount = selectedObjectIds.length;
  const isDepthTool = currentTool === 'offset' || currentTool === 'extrude';
  const effectiveUnitScale = Number.isFinite(unitScaleMm) && unitScaleMm > 0 ? unitScaleMm : 1;

  if (!toolDef.isSculptingTool) {
    return null;
  }

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: 20,
      backgroundColor: 'rgba(6, 10, 20, 0.82)',
      padding: '15px',
      borderRadius: '12px',
      border: '1px solid rgba(74, 144, 226, 0.25)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 24px rgba(6, 10, 20, 0.45)',
      color: 'white',
      fontFamily: 'monospace',
      minWidth: '250px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '14px' }}>
        {toolDef.label} Tool Controls
      </h3>

      {selectionCount === 0 && (
        <div style={{
          backgroundColor: 'rgba(255,165,0,0.2)',
          border: '1px solid orange',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '12px'
        }}>
          ⚠️ Select an object to start sculpting
        </div>
      )}

      {selectionCount > 1 && (
        <div style={{
          backgroundColor: 'rgba(74,144,226,0.2)',
          border: '1px solid #4a90e2',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          fontSize: '12px'
        }}>
          ℹ️ Sculpting is only available for a single object.
        </div>
      )}

      {selectionCount === 1 && (
        <>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Brush Size: {brushSize.toFixed(2)}</span>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={brushSize}
                onChange={(e) => onBrushSizeChange(parseFloat(e.target.value))}
                style={{ width: '150px', marginLeft: '10px', accentColor: '#4a90e2' }}
              />
            </label>
          </div>

          {isDepthTool ? (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Depth: {(currentTool === 'offset' ? offsetDepthMm : extrudeDepthMm).toFixed(2)} mm</span>
              </label>
              <input
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={currentTool === 'offset' ? offsetDepthMm : extrudeDepthMm}
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  if (currentTool === 'offset') {
                    onOffsetDepthChange(Number.isFinite(value) && value > 0 ? value : 0.1);
                  } else {
                    onExtrudeDepthChange(Number.isFinite(value) && value > 0 ? value : 0.1);
                  }
                }}
                style={{ width: '100%', accentColor: '#4a90e2' }}
              />
              <div style={{ fontSize: '10px', color: '#8fb9ff', marginTop: '6px' }}>
                Unit scale: {effectiveUnitScale.toFixed(2)} mm per unit • Click model to apply
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Strength: {(brushStrength * 100).toFixed(0)}%</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={brushStrength}
                onChange={(e) => onBrushStrengthChange(parseFloat(e.target.value))}
                style={{ width: '150px', marginLeft: '10px', accentColor: '#4a90e2' }}
              />
              </label>
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', marginBottom: '8px' }}>
              <strong>Symmetry:</strong>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['x', 'y', 'z'] as const).map(axis => (
                <button
                  key={axis}
                  onClick={() => onSymmetryChange(axis, !symmetryAxes[axis])}
                  style={{
                    flex: 1,
                    padding: '6px',
                    backgroundColor: symmetryAxes[axis] ? '#4a90e2' : '#2c2c2c',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '12px',
                    fontWeight: symmetryAxes[axis] ? 'bold' : 'normal',
                    boxShadow: symmetryAxes[axis] ? '0 0 8px rgba(74, 144, 226, 0.5)' : 'none',
                  }}
                  title={`Mirror on ${axis.toUpperCase()}-axis`}
                >
                  {axis.toUpperCase()}
                </button>
              ))}
            </div>
            {(symmetryAxes.x || symmetryAxes.y || symmetryAxes.z) && (
              <div style={{
                fontSize: '10px',
                color: '#4a90e2',
                marginTop: '4px',
                textAlign: 'center'
              }}>
                Mirroring on {[
                  symmetryAxes.x && 'X',
                  symmetryAxes.y && 'Y',
                  symmetryAxes.z && 'Z'
                ].filter(Boolean).join(', ')} axis
              </div>
            )}
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.2)',
            paddingTop: '10px',
            marginTop: '10px',
            fontSize: '11px',
            color: '#aaa'
          }}>
            <div>Shortcuts:</div>
            <div>[ / ] - Brush size</div>
            {!isDepthTool && <div>Shift+[ / Shift+] - Strength</div>}
            <div>X / Y / Z - Toggle symmetry</div>
          </div>
        </>
      )}
    </div>
  );
}
