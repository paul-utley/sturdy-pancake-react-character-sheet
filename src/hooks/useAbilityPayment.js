import { useState } from 'react';

export default function useAbilityPayment({ character, setCharacter }) {
  const [inactiveAbilityButtons, setInactiveAbilityButtons] = useState([]);
  const [paymentModalAbility, setPaymentModalAbility] = useState(null);

  const handleAbilityButtonClick = (abilityId) => {
    const ability = character.abilities.find(a => a.id === abilityId);
    if (!ability) return;

    const costMatch = ability.label.match(/\{(.+?)\}/);
    if (!costMatch) {
      setInactiveAbilityButtons(prev => [...prev, abilityId]);
      return;
    }

    const costString = costMatch[1];

    if (costString.toUpperCase() === '1 MOMENTUM') {
      if (character.momentum) {
        setCharacter(prev => ({ ...prev, momentum: false }));
        setInactiveAbilityButtons(prev => [...prev, abilityId]);
      }
      return;
    }

    const parts = costString.split(' ');
    const cost = parseInt(parts[0], 10);
    const resource = parts[1];

    if (resource.toLowerCase() === 'shrouded') {
      setCharacter(prev => {
        const idx = prev.attributes.findIndex(a => a.name.toLowerCase() === 'shrouded');
        if (idx !== -1 && prev.attributes[idx].value >= cost) {
          const newAttributes = [...prev.attributes];
          newAttributes[idx] = { ...newAttributes[idx], value: newAttributes[idx].value - cost };
          setInactiveAbilityButtons(prev => [...prev, abilityId]);
          return { ...prev, attributes: newAttributes };
        }
        return prev;
      });
    } else {
      setPaymentModalAbility(ability);
    }
  };

  const handlePaymentConfirm = (ability, resource) => {
    const costMatch = ability.label.match(/\{(.+?)\}/);
    const cost = parseInt(costMatch[1].split(' ')[0], 10);

    setCharacter(prev => {
      const idx = prev.attributes.findIndex(a => a.name.toLowerCase() === resource.toLowerCase());
      if (idx !== -1 && prev.attributes[idx].value >= cost) {
        const newAttributes = [...prev.attributes];
        newAttributes[idx] = { ...newAttributes[idx], value: newAttributes[idx].value - cost };
        setInactiveAbilityButtons(prev => [...prev, ability.id]);
        return { ...prev, attributes: newAttributes };
      }
      return prev;
    });

    setPaymentModalAbility(null);
  };

  const handleMomentumToggle = () => {
    const gaining = !character.momentum;
    if (gaining) {
      const momentumAbilityIds = character.abilities
        .filter(a => a.label.includes('{1 MOMENTUM}'))
        .map(a => a.id);
      setInactiveAbilityButtons(prev => prev.filter(id => !momentumAbilityIds.includes(id)));
    }
    setCharacter(prev => ({ ...prev, momentum: gaining }));
  };

  const checkAffordability = (ability) => {
    const costMatch = ability.label.match(/\{(.+?)\}/);
    if (!costMatch) return true;

    const parts = costMatch[1].trim().split(' ');
    const cost = parseInt(parts[0], 10);
    const resource = parts[1];

    if (resource === 'Momentum') return character.momentum;

    const primary = character.attributes.find(a => a.name.toLowerCase() === resource.toLowerCase());
    const canAffordPrimary = primary && primary.value >= cost;

    if (resource.toLowerCase() === 'shrouded') return canAffordPrimary;

    const resolve = character.attributes.find(a => a.name === 'Resolve');
    return canAffordPrimary || (resolve && resolve.value >= cost);
  };

  return {
    inactiveAbilityButtons,
    setInactiveAbilityButtons,
    paymentModalAbility,
    setPaymentModalAbility,
    handleAbilityButtonClick,
    handlePaymentConfirm,
    handleMomentumToggle,
    checkAffordability,
  };
}
