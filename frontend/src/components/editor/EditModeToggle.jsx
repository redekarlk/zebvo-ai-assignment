'use client';

import { useContext } from 'react';
import { EditModeContext } from '@/context/EditModeContext';
import Button from '@/components/common/Button';

export default function EditModeToggle() {
  const { editMode, setEditMode } = useContext(EditModeContext);

  if (!editMode && !setEditMode) {
    console.warn('EditModeToggle: EditModeContext not properly initialized');
    return null;
  }

  return (
    <div className="edit-mode-toggle">
      <Button
        onClick={() => setEditMode(!editMode)}
        variant={editMode ? 'primary' : 'secondary'}
        className="flex items-center gap-2"
      >
        {editMode ? (
          <>
            <span>✏️</span>
            <span>Editing</span>
          </>
        ) : (
          <>
            <span>👁️</span>
            <span>Preview</span>
          </>
        )}
      </Button>
    </div>
  );
}
