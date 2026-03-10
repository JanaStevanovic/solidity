import React, { useEffect, useState } from 'react';
import './EvaluationDetailsModal.css';

const EvaluationDetailsModal = ({ contract, account, onClose, onRefresh }) => {
  const [details, setDetails] = useState({
    startup: '',
    platform: '',
    state: '',
    dataComplete: false,
    termsAccepted: false,
    ideaTitle: '',
    targetMarket: '',
    startupStage: '',
    feedback: '',
  });

  const loadDetails = async () => {
    try {
      const [
        startup,
        platform,
        state,
        dataComplete,
        termsAccepted,
        ideaTitle,
        targetMarket,
        startupStage,
      ] = await Promise.all([
        contract.methods.startup().call(),
        contract.methods.platform().call(),
        contract.methods.getCurrentState().call(),
        contract.methods.dataComplete().call(),
        contract.methods.termsAccepted().call(),
        contract.methods.ideaTitle().call(),
        contract.methods.targetMarket().call(),
        contract.methods.startupStage().call(),
      ]);

      let feedback = '';
      try {
        feedback = await contract.methods.getFeedback().call({ from: account });
      } catch (e) {
        feedback = 'Feedback još nije dostupan.';
      }

      setDetails({
        startup,
        platform,
        state,
        dataComplete,
        termsAccepted,
        ideaTitle,
        targetMarket,
        startupStage,
        feedback,
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (contract) {
      loadDetails();
    }
  }, [contract]);

  const acceptTerms = async () => {
    try {
      await contract.methods.acceptTerms().send({ from: account });
      await loadDetails();
      onRefresh();
    } catch (error) {
      console.error(error);
      alert('AcceptTerms nije uspeo.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card details-card">
        <h2>Detalji evaluacije</h2>

        <p><strong>Startup:</strong> {details.startup}</p>
        <p><strong>Platform:</strong> {details.platform}</p>
        <p><strong>Status:</strong> {details.state}</p>
        <p><strong>Podaci kompletni:</strong> {details.dataComplete ? 'Da' : 'Ne'}</p>
        <p><strong>Uslovi prihvaćeni:</strong> {details.termsAccepted ? 'Da' : 'Ne'}</p>
        <p><strong>Naziv ideje:</strong> {details.ideaTitle}</p>
        <p><strong>Ciljno tržište:</strong> {details.targetMarket}</p>
        <p><strong>Faza razvoja:</strong> {details.startupStage}</p>
        <p><strong>Feedback:</strong> {details.feedback}</p>

        <div className="modal-actions">
          <button className="primary-button" onClick={acceptTerms}>
            Prihvati uslove
          </button>
          <button className="secondary-button" onClick={loadDetails}>
            Osveži
          </button>
          <button className="secondary-button" onClick={onClose}>
            Zatvori
          </button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDetailsModal;