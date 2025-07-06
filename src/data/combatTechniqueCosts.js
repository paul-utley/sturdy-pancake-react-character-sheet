const combatTechniqueCosts = {
  role: {
    options: [
    {
      key:"Melee Combat",
      value: 0
    },
    {
      key:"Ranged Combat",
      value: 0
    },
    {
      key:"Versatile",
      value: 2
    }
  ]
  },
  zone: {
    units: "Space(s)",
    options: [
    {
      key:"1",
      value: 0
    },
    {
      key:"2",
      value: 1
    }
  ]
  },
  armament: {
    options: [
    {
      key:"Complex Matériel",
      value: 0
    },
    {
      key:"Simple Matériel",
      value: 1
    },
    {
      key:"Innate",
      value: 2
    }
  ]
  },
  range: {
    units: "Space(s)",
    options: [
    {
      key:"Optimal: 3-5, Increment: 3",
      value: 0
    },
    {
      key:"Optimal: 4-8, Increment: 5",
      value: 1
    },
    {
      key:"Optimal: 5-14, Increment: 10",
      value: 2
    },
    {
      key:"Optimal: 6-20, Increment: 15",
      value: 3
    },
    
  ]
  },
  damage: {
    options: [ 
    {
      key:"2d6",
      value: 0
    },
    {
      key:"1d6 + 2d4",
      value: 1
    },
    {
      key:"3d6",
      value: 2
    },
    {
      key:"2d6 + 2d4",
      value: 3
    },
    {
      key:"4d6",
      value: 4
    },
    {
      key:"3d6 + 2d4",
      value: 5
    },
    {
      key:"5d6",
      value: 6
    },
    {
      key:"4d6 + 2d4",
      value: 7
    },
    {
      key:"6d6",
      value: 8
    },
    {
      key:"5d6 + 2d4",
      value: 9
    },
    {
      key:"7d6",
      value: 10
    }
  ]
  },
  traits: {
    options: [
      {
        label: 'Brutal',
        text: 'When inflicting Damage to Health, add 1d6 to the Damage Pool.',
        cost: 1
      },
      {
        label: 'Cumbersome',
        text: 'This Combat Technique\'s Eqiupment takes up an additional Inventory Space and swapping to it Costs {1 Daring}. Additionally, this Combat Technique gains 2 Technique Points.',
        cost: 0
      },
      {
        label: 'Destructive',
        text: 'Attack Checks are particullarly effective at destroying Obstacles and Unattended Objects. Additionally, treat Heavy Cover as if it is Light Cover and Light Cover is ignored.',
        cost: 1
      },
      {
        label: 'Discreet',
        text: 'If you are undetected, Attack Checks do not immediately reveal your position.',
        cost: 1
      },
      {
        label: 'Ensnaring',
        text: 'Attack Checks that result in a Moderate or Major Success automatically gain the "Ensnare" Attack Effect.',
        cost: 2
      },
      {
        label: 'Forceful',
        text: 'Attack Checks that result in a Moderate or Major Success automatically gain the "Shove" Attack Effect.',
        cost: 2
      },
      {
        label: 'Guarding',
        text: 'When Blocking, reroll any Misses.',
        cost: 2
      },
      {
        label: 'Limited Use',
        text: 'Attack Checks cause you to Expend this Combat Technique. Additionally, this Combat Technique gains 4 Technique Points.',
        cost: 0
      },
      {
        label: 'Low-Profile',
        text: 'The Equipment used by this Combat Technique is easy to hide or conceal. Attempts to do so are always considered Exerted.',
        cost: 1
      },
      {
        label: 'Multiple Attacks',
        text: 'Whenever you perform the Attack! Action you can choose to make two separate Attack Checks instead with a -1 penalty.',
        cost: 3
      },
      {
        label: 'Additional Uses',
        text: 'Requires the "Limited Use" Combat Technique Trait. You can ignore two instances in an Encounter where you would Expend this Combat Technique.',
        cost: 1
      },
      {
        label: 'Sidearm',
        text: 'You can perform Attack Checks with this Combat Technique without needing to swap to it. Can not be used with Cumbersome.',
        cost: 1
      },
      {
        label: 'Stationary',
        text: 'After Exerting an Attack Check, all Attack Checks are Exerted at no cost. Performing a Dash or suffering forced movement ends this effect.',
        cost: 2
      },
      {
        label: 'Sweeping Strikes',
        text: 'Select up to one Character within one Space of the Target, Clash Damage Pool vs Damage Reduction, reroll any Hits.',
        cost: 2
      },
      {
        label: 'Vicious',
        text: 'Attack Checks that result in a Moderate or Major Success Inflict 1 Drain.',
        cost: 1
      }
    ]
  }
}

export default combatTechniqueCosts;
