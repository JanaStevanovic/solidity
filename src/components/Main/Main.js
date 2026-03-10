import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import CreateEvaluationModal from '../CreateEvaluationModal/CreateEvaluationModal';
import EvaluationDetailsModal from '../EvaluationDetailsModal/EvaluationDetailsModal';
import StartupIdeaEvaluationABI from '../../contracts/StartupIdeaEvaluation.json';
import './Main.css';

const contractAddress = 'OVDE_UNESI_ADRESU_UGOVORA';

const Main = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [status, setStatus] = useState('');

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('MetaMask nije instaliran.');
        return;
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      setAccount(accounts[0]);

      window.ethereum.on('accountsChanged', (newAccounts) => {
        setAccount(newAccounts[0] || null);
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return;

      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const contractInstance = new web3Instance.eth.Contract(
        StartupIdeaEvaluationABI.abi,
        contractAddress
      );

      setContract(contractInstance);
    };

    init();
  }, []);

  const loadCurrentState = async () => {
    if (!contract) return;
    try {
      const currentState = await contract.methods.getCurrentState().call();
      setStatus(currentState);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (contract) {
      loadCurrentState();
    }
  }, [contract]);

  return (
    <div className="main-container">
      <div className="hero-card">
        <h1>Startup Idea Evaluation dApp</h1>
        <p>Frontend za unos ideje i pregled statusa evaluacije.</p>

        {!account ? (
          <button className="primary-button" onClick={connectWallet}>
            Poveži MetaMask
          </button>
        ) : (
          <div className="wallet-box">
            <strong>Povezan nalog:</strong>
            <span>{account}</span>
          </div>
        )}

        <div className="status-box">
          <strong>Status procesa:</strong>
          <span>{status || 'Nije učitano'}</span>
        </div>

        <div className="actions-row">
          <button
            className="primary-button"
            onClick={() => setShowCreateModal(true)}
          >
            Unesi ideju
          </button>

          <button
            className="secondary-button"
            onClick={() => setShowDetailsModal(true)}
          >
            Prikaži detalje
          </button>

          <button className="secondary-button" onClick={loadCurrentState}>
            Osveži status
          </button>
        </div>
      </div>

      {showCreateModal && contract && (
        <CreateEvaluationModal
          contract={contract}
          account={account}
          onClose={() => {
            setShowCreateModal(false);
            loadCurrentState();
          }}
        />
      )}

      {showDetailsModal && contract && (
        <EvaluationDetailsModal
          contract={contract}
          account={account}
          onClose={() => setShowDetailsModal(false)}
          onRefresh={loadCurrentState}
        />
      )}
    </div>
  );
};

export default Main;