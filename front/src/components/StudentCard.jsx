import React, { useState } from 'react';
import MyButton from './UI/MyButton';
import '../styles/StudentCard.css';

const StudentCard = ({ student, onDelete, onSaveEdit }) => {
  const [editMode, setEditMode] = useState(false);
  const [editStory, setEditStory] = useState(student.story);
  const [isStoryExpanded, setIsStoryExpanded] = useState(false);

  const handleSave = () => {
    onSaveEdit(student.id, editStory);
    setEditMode(false);
  };

  return (
    <div className="student-card">
      <strong>{student.studentName}</strong>
      {!editMode ? (
        <>
          <p className={`student-story ${isStoryExpanded ? 'expanded' : 'truncated'}`}>
            {student.story}
            {!isStoryExpanded && student.story.length > 50 && (
              <span
                className="read-more"
                onClick={() => setIsStoryExpanded(true)}
              >
                Читать далее
              </span>
            )}
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <MyButton onClick={() => setEditMode(true)} style={{ flex: 1 }}>
              Редактировать
            </MyButton>
            <MyButton
              onClick={() => onDelete(student.id)}
            >
              Удалить
            </MyButton>
          </div>
        </>
      ) : (
        <>
          <textarea
            value={editStory}
            onChange={(e) => setEditStory(e.target.value)}
            rows={4}
            style={{ width: '100%', marginBottom: 8, fontSize: 14, padding: 6 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <MyButton
              onClick={() => setEditMode(false)}
            >
              Отмена
            </MyButton>
            <MyButton onClick={handleSave} style={{ flex: 1 }}>
              Сохранить
            </MyButton>
          </div>
        </>
      )}

      {isStoryExpanded && (
        <div className="story-modal">
          <div className="story-modal-content">
            <h3>История {student.studentName}</h3>
            <p>{student.story}</p>
            <MyButton
              onClick={() => setIsStoryExpanded(false)}
            >
              Закрыть
            </MyButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentCard;