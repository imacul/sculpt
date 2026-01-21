import type { PrimitiveType, ToolType } from '../../types';
import { TOOL_DEFINITIONS, PRIMITIVE_DEFINITIONS } from '../../services/tools/toolDefinitions';

interface ToolbarProps {
  currentTool: ToolType;
  selectedPrimitive: PrimitiveType;
  selectedObjectIds: string[];
  onToolChange: (tool: ToolType) => void;
  onPrimitiveSelect: (primitive: PrimitiveType) => void;
  onFileSelect: (file: File) => void;
}

export function Toolbar({
  currentTool,
  selectedPrimitive,
  selectedObjectIds,
  onToolChange,
  onPrimitiveSelect,
  onFileSelect,
}: ToolbarProps) {
  const selectionCount = selectedObjectIds.length;

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      zIndex: 100,
    }}>
      {/* Tool Selection */}
      <div style={{
        display: 'flex',
        gap: '5px',
        backgroundColor: 'rgba(6, 10, 20, 0.82)',
        padding: '10px',
        borderRadius: '12px',
        border: '1px solid rgba(74, 144, 226, 0.25)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 24px rgba(6, 10, 20, 0.45)',
      }}>
        {TOOL_DEFINITIONS.map((tool) => {
          let isDisabled = false;
          let title = tool.label;

          if (tool.requiresObject) {
            if (tool.id === 'join') {
              isDisabled = selectionCount !== 2;
              title = isDisabled ? 'Select exactly two objects to join' : tool.label;
            } else {
              isDisabled = selectionCount === 0;
              title = isDisabled ? `${tool.label} (Select an object first)` : tool.label;
            }
          }

          return (
            <button
              key={tool.id}
              onClick={() => !isDisabled && onToolChange(tool.id)}
              disabled={isDisabled}
              style={{
                width: '50px',
                height: '50px',
                backgroundColor: currentTool === tool.id ? 'rgba(74, 144, 226, 0.9)' :
                                isDisabled ? 'rgba(10, 14, 26, 0.7)' : 'rgba(20, 28, 48, 0.9)',
                border: '1px solid rgba(74, 144, 226, 0.25)',
                borderRadius: '10px',
                color: isDisabled ? '#5e6b85' : 'white',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontSize: '20px',
                opacity: isDisabled ? 0.5 : 1,
              }}
              title={title}
            >
              <span>{tool.icon}</span>
              <span style={{ fontSize: '9px', marginTop: '2px' }}>{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Primitive Selection */}
      {currentTool === 'add-primitive' && (
        <div style={{
          display: 'flex',
          gap: '5px',
          backgroundColor: 'rgba(6, 10, 20, 0.82)',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid rgba(74, 144, 226, 0.25)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px rgba(6, 10, 20, 0.45)',
        }}>
          {PRIMITIVE_DEFINITIONS.map((primitive) => (
            <button
              key={primitive.id}
              onClick={() => onPrimitiveSelect(primitive.id)}
              style={{
                width: '45px',
                height: '45px',
                backgroundColor: selectedPrimitive === primitive.id ? 'rgba(74, 144, 226, 0.9)' : 'rgba(20, 28, 48, 0.9)',
                border: '1px solid rgba(74, 144, 226, 0.25)',
                borderRadius: '10px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
                fontSize: '18px',
              }}
              title={primitive.label}
            >
              <span>{primitive.icon}</span>
              <span style={{ fontSize: '8px', marginTop: '2px' }}>{primitive.label}</span>
            </button>
          ))}
          <input
            type="file"
            accept=".glb,.gltf,.obj,.stl,.ply"
            style={{ display: 'none' }}
            id="import-model"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onFileSelect(e.target.files[0]);
              }
            }}
          />
          <label
            htmlFor="import-model"
            style={{
              width: '45px',
              height: '45px',
              backgroundColor: 'rgba(20, 28, 48, 0.9)',
              border: '1px solid rgba(74, 144, 226, 0.25)',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              fontSize: '18px',
            }}
            title="Import Model"
          >
            <span>📁</span>
            <span style={{ fontSize: '8px', marginTop: '2px' }}>Import</span>
          </label>
        </div>
      )}
    </div>
  );
}
