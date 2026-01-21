import type { ToolType, PrimitiveType } from '../../types';
import type * as THREE from 'three';
import { getToolDefinition } from '../../services/tools/toolDefinitions';

interface StatusOverlayProps {
  currentTool: ToolType;
  selectedPrimitive: PrimitiveType;
  measurePoints?: Array<THREE.Vector3 | null>;
  unitScaleMm?: number;
}

export function StatusOverlay({ currentTool, selectedPrimitive, measurePoints, unitScaleMm }: StatusOverlayProps) {
  const toolDef = getToolDefinition(currentTool);
  const [measureStart, measureEnd] = measurePoints ?? [];
  const effectiveUnitScale = unitScaleMm && unitScaleMm > 0 ? unitScaleMm : 1;
  const distanceMm = measureStart && measureEnd
    ? measureStart.distanceTo(measureEnd) * effectiveUnitScale
    : null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      backgroundColor: 'rgba(6, 10, 20, 0.82)',
      color: 'white',
      padding: '15px',
      borderRadius: '12px',
      border: '1px solid rgba(74, 144, 226, 0.25)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 8px 24px rgba(6, 10, 20, 0.45)',
      fontFamily: 'monospace',
      fontSize: '12px',
      minWidth: '250px',
    }}>
      <div>
        <strong>Current Tool:</strong> {toolDef.label}
      </div>

      <div style={{ marginTop: '5px' }}>
        {currentTool === 'select' && 'Click objects to select'}
        {currentTool === 'add-primitive' && `Click and drag to place ${selectedPrimitive}`}
        {currentTool === 'measure' && 'Click two points to measure distance'}
        {toolDef.helpText && currentTool !== 'select' && currentTool !== 'add-primitive' && toolDef.helpText}
      </div>
      {currentTool === 'measure' && (
        <div style={{ marginTop: '8px' }}>
          <strong>Distance:</strong>{' '}
          {distanceMm === null ? 'Select two points' : `${distanceMm.toFixed(2)} mm`}
        </div>
      )}

      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div><strong>Camera Controls:</strong></div>
        <div>Middle Click: Rotate</div>
        <div>Right Click: Pan</div>
        <div>Scroll: Zoom</div>
      </div>

      <div style={{
        marginTop: '10px',
        paddingTop: '10px',
        borderTop: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div><strong>Keyboard Shortcuts:</strong></div>
        <div>S: Select tool</div>
        <div>A: Add primitive</div>
        <div>B: Add material</div>
        {toolDef.isSculptingTool && (
          <>
            <div>[ / ]: Adjust brush size</div>
            <div>Shift + [ / ]: Adjust strength</div>
          </>
        )}
      </div>
    </div>
  );
}
