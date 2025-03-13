// root/apps/next-js/src/features/app/automation/components/AutomationFlow.tsx

import { Button } from '@teable/ui-lib/shadcn/ui/button';
import { Plus } from 'lucide-react';
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { IAction } from '../types';

interface AutomationFlowProps {
  flow?: IAction[];
  onNodeClick?: (node: IAction) => void;
  onReorder?: (sourceIndex: number, targetIndex: number) => void;
  onAddStep: () => void;
}

export function AutomationFlow({ flow, onNodeClick, onReorder, onAddStep }: AutomationFlowProps) {
  return (
    <div
      className="relative h-full overflow-auto bg-popover p-8"
      style={{
        backgroundImage: 'radial-gradient(hsl(var(--border)) 2px, transparent 1px)',
        backgroundSize: '16px 16px',
      }}
    >
      {!flow || flow.length === 0
        ? ''
        : flow.map((node, index) => (
            <DraggableFlowNode
              key={node.id}
              node={node}
              index={index}
              onClick={() => onNodeClick?.(node)}
              onReorder={onReorder}
            />
          ))}
      <div className="flex justify-center">
        <Button variant="outline" className="w-96" onClick={onAddStep}>
          <Plus />
          Новый шаг
        </Button>
      </div>
    </div>
  );
}

const ItemTypes = {
  FLOW_NODE: 'flowNode',
};

interface DraggableFlowNodeProps {
  node: IAction;
  index: number;
  onClick?: () => void;
  onReorder?: (sourceIndex: number, targetIndex: number) => void;
}

function DraggableFlowNode({ node, index, onClick, onReorder }: DraggableFlowNodeProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemTypes.FLOW_NODE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ItemTypes.FLOW_NODE,
    hover: () => {
      // Можно реализовать динамическую подсветку
    },
    drop: (item: { index: number }) => {
      if (!onReorder) return;
      const dragIndex = item.index;
      const dropIndex = index;
      if (dragIndex !== dropIndex) {
        onReorder(dragIndex, dropIndex);
      }
    },
  });

  const ref = (el: HTMLDivElement) => {
    dragRef(el);
    dropRef(el);
  };

  const getNodeClasses = (nodeType: string) => {
    switch (nodeType) {
      case 'trigger':
        return 'bg-blue-100 text-blue-800';
      case 'logic':
        return 'bg-yellow-100 text-yellow-800';
      case 'script':
        return 'bg-violet-100 text-violet-800';
      case 'action':
      default:
        return 'bg-pink-100 text-pink-800';
    }
  };

  return (
    <div
      ref={ref}
      className="mb-6 flex flex-col items-center"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
    >
      <button
        className={`
          ${getNodeClasses(node.type)}
          w-48 rounded-md px-4 py-2 text-sm shadow-md
          transition-transform hover:scale-105 hover:shadow-lg
        `}
        onClick={onClick}
      >
        {node.label}
      </button>
    </div>
  );
}
