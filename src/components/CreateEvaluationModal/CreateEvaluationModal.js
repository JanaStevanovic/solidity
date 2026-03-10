import React, { useState } from 'react';
import './CreateEvaluationModal.css';

const CreateEvaluationModal = ({ contract, account, onClose }) => {
  const [formData, setFormData] = useState({
    ideaTitle: '',
    problemDescription: '',
    proposedSolution: '',
    targetMarket: '',
    startupStage: '',
    pitchDeckHash: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await contract.methods
        .submitIdeaData(
          formData.ideaTitle,
          formData.problemDescription,
          formData.proposedSolution,
          formData.targetMarket,
          formData.startupStage,
          formData.pitchDeckHash
        )
        .send({ from: account });

      alert('Ideja je uspešno poslata.');
      onClose();
    } catch (error) {
      console.error(error);
      alert('Transakcija nije uspela.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h2>Unos startup ideje</h2>

        <input name="ideaTitle" placeholder="Naziv ideje" onChange={handleChange} />
        <textarea name="problemDescription" placeholder="Opis problema" onChange={handleChange} />
        <textarea name="proposedSolution" placeholder="Predloženo rešenje" onChange={handleChange} />
        <input name="targetMarket" placeholder="Ciljno tržište" onChange={handleChange} />
        <input name="startupStage" placeholder="Faza razvoja" onChange={handleChange} />
        <input name="pitchDeckHash" placeholder="Hash pitch deck dokumenta" onChange={handleChange} />

        <div className="modal-actions">
          <button className="primary-button" onClick={handleSubmit}>
            Pošalji ideju
          </button>
          <button className="secondary-button" onClick={onClose}>
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEvaluationModal;