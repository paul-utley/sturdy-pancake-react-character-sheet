import React from 'react';
import './PaymentChoiceModal.css';

const PaymentChoiceModal = ({ ability, character, onClose, onConfirm }) => {
  if (!ability) return null;

  const costMatch = ability.label.match(/\{(.+?)\}/);
  const costString = costMatch ? costMatch[1] : '';
  const parts = costString.trim().split(' ');
  const cost = parseInt(parts[0], 10);
  const resource = parts[1];

  const resolveAttr = character.attributes.find(attr => attr.name === 'Resolve');
  const primaryAttr = character.attributes.find(attr => attr.name.toLowerCase() === resource.toLowerCase());

  const canAffordPrimary = primaryAttr && primaryAttr.value >= cost;
  const canAffordResolve = resolveAttr && resolveAttr.value >= cost;

  const displayLabel = ability.label.split('(')[0].trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>×</button>
        <h2>Pay for <strong>{displayLabel}</strong></h2>
        <div className="payment-options">
          <button
            className="payment-btn"
            onClick={() => onConfirm(resource)}
            disabled={!canAffordPrimary}
          >
            {cost} {resource} ({primaryAttr ? primaryAttr.value : 0} available)
          </button>
          {resource.toLowerCase() !== 'shrouded' && (
            <button
              className="payment-btn"
              onClick={() => onConfirm('Resolve')}
              disabled={!canAffordResolve}
            >
              {cost} Resolve ({resolveAttr ? resolveAttr.value : 0} available)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentChoiceModal;
