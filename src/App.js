import React, { useState } from 'react';
import useMediaQuery from './hooks/useMediaQuery';
import useCharacterStore from './hooks/useCharacterStore';
import useCharacterHandlers from './hooks/useCharacterHandlers';
import useAbilityPayment from './hooks/useAbilityPayment';
import useRoundActions from './hooks/useRoundActions';
import useCharacterManager from './hooks/useCharacterManager';
import './App.css';
import AttributeBox from './components/AttributeBox/AttributeBox';
import MobileLayout from './components/MobileLayout/MobileLayout';
import DesktopLayout from './components/DesktopLayout/DesktopLayout';
import ActionButtons from './components/ActionButtons/ActionButtons';
import DataModal from './components/DataModal/DataModal';
import PaymentChoiceModal from './components/PaymentChoiceModal/PaymentChoiceModal';
import CharacterModal from './components/LoadCharacterModal/LoadCharacterModal';
import ImportCharacterModal from './components/ImportCharacterModal/ImportCharacterModal';

function App() {
  const { characters, setCharacters, character, setCharacter, activeCharacterId, setActiveCharacterId } = useCharacterStore();

  const [isCharacterModalOpen, setCharacterModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('character');
  const [isDataModalOpen, setDataModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const isMediumScreen = useMediaQuery('(max-width: 1299px)');
  const isMobileScreen = useMediaQuery('(max-width: 1300px)');

  const {
    inactiveAbilityButtons,
    setInactiveAbilityButtons,
    paymentModalAbility,
    setPaymentModalAbility,
    handleAbilityButtonClick,
    handlePaymentConfirm,
    handleMomentumToggle,
    checkAffordability,
  } = useAbilityPayment({ character, setCharacter });

  const { highlightedFields, setHighlightedFields, handleNewRound, handleQuickRest, handleLongRest } = useRoundActions({
    setCharacter,
    clearAbilityButtons: () => setInactiveAbilityButtons([]),
  });

  const {
    handleFieldChange,
    handleAttributeChange,
    handleAbilitiesChange,
    handleAddAbility,
    handleSkillChange,
    handleHealthChange,
    handleVigorChange,
    handleDashesChange,
    handleDRChange,
    handleArmorChange,
    handleAddTechnique,
    handleTechniqueChange,
    handleRemoveTechnique,
  } = useCharacterHandlers({ character, setCharacter });

  const { handleReset, handleLoadCharacter, handleDeleteCharacter, handleImportCharacter } = useCharacterManager({
    characters,
    setCharacters,
    activeCharacterId,
    setActiveCharacterId,
    setCharacterModalOpen,
    setImportModalOpen,
    clearHighlights: () => setHighlightedFields([]),
    clearAbilityButtons: () => setInactiveAbilityButtons([]),
  });

  const handleLockToggle = () => setIsLocked(prev => !prev);

  if (!activeCharacterId || !character) {
    return (
      <CharacterModal
        isOpen={true}
        canClose={false}
        characters={characters}
        onLoad={handleLoadCharacter}
        onDelete={handleDeleteCharacter}
        onNewCharacter={handleReset}
      />
    );
  }

  const sharedLayoutProps = {
    character,
    isLocked,
    highlightedFields,
    inactiveAbilityButtons,
    checkAffordability,
    handleAbilityButtonClick,
    handleAddAbility,
    handleAbilitiesChange,
    handleFieldChange,
    handleSkillChange,
    handleTechniqueChange,
    handleRemoveTechnique,
    handleAddTechnique,
    handleHealthChange,
    handleVigorChange,
    handleDashesChange,
    handleDRChange,
    handleArmorChange,
    handleMomentumToggle,
  };

  return (
    <>
      <div className="sheet">
        {isDataModalOpen && (
          <DataModal characterData={character} onClose={() => setDataModalOpen(false)} />
        )}
        {paymentModalAbility && (
          <PaymentChoiceModal
            ability={paymentModalAbility}
            character={character}
            onClose={() => setPaymentModalAbility(null)}
            onConfirm={(resource) => handlePaymentConfirm(paymentModalAbility, resource)}
          />
        )}

        <div className="stat-grid">
          <div className="attributes-container">
            {(character.attributes || []).map((attr, index) => (
              <AttributeBox
                key={attr.name}
                name={attr.name}
                value={attr.value}
                max={attr.max}
                onChange={(updatedAttribute) => handleAttributeChange(index, updatedAttribute)}
                canExceedMax={attr.name === 'Resolve'}
                isHighlighted={highlightedFields.includes(attr.name)}
                isLocked={isLocked}
              />
            ))}
          </div>
          <div className="stat-action-buttons">
            <div className="stat-button-row">
              <button className="action-btn icon-btn" onClick={handleQuickRest} title="Quick Rest">
                <img src="break.png" alt="Quick Rest" />
              </button>
              <button className="action-btn icon-btn" onClick={handleLongRest} title="Long Rest">
                <img src="rest.png" alt="Long Rest" />
              </button>
            </div>
            <div className="stat-button-row">
              <button className="action-btn icon-btn" onClick={handleNewRound} title="New Round">
                <img src="reset.png" alt="New Round" />
              </button>
              <button className="action-btn icon-btn" onClick={handleLockToggle} title={isLocked ? 'Unlock Sheet' : 'Lock Sheet'}>
                <img src={isLocked ? 'locked.png' : 'unlocked.png'} alt={isLocked ? 'Unlock Sheet' : 'Lock Sheet'} />
              </button>
            </div>
          </div>
        </div>

        {isMobileScreen ? (
          <MobileLayout
            {...sharedLayoutProps}
            activeMobileTab={activeMobileTab}
            setActiveMobileTab={setActiveMobileTab}
          />
        ) : (
          <DesktopLayout
            {...sharedLayoutProps}
            isMediumScreen={isMediumScreen}
          />
        )}
      </div>

      <ActionButtons onOpenCharactersModal={() => setCharacterModalOpen(true)} />
      <CharacterModal
        isOpen={isCharacterModalOpen}
        canClose={true}
        onClose={() => setCharacterModalOpen(false)}
        characters={characters}
        onLoad={handleLoadCharacter}
        onDelete={handleDeleteCharacter}
        onNewCharacter={handleReset}
        onImport={() => setImportModalOpen(true)}
      />
      <ImportCharacterModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportCharacter}
      />
    </>
  );
}

export default App;
