import {
  ATTRIBUTE_XP,
  ATTRIBUTE_CRIT,
  ATTRIBUTE_RES3,
  ATTRIBUTE_RES1,
  ATTRIBUTE_ITEM,
  ATTRIBUTE_MAGIC,
  ATTRIBUTE_RES2,
  RARITY_COMMON,
  RARITY_EPIC,
  RARITY_LEGENDARY,
  RARITY_RARE,
  ATTRIBUTE_CRAFT,
} from 'core/remix/state';

export const gold = {
  map: {
    cutout: '#1a1e2d',
    texture: '#314068',
    dark_texture: '#101219',
  },
  exp: {
    loading: '#6b4906',
    texture: '#ffba1a',
  },
  attribute: {
    [ATTRIBUTE_RES1]: '#d5a2e2',
    [ATTRIBUTE_RES2]: '#9ab8db',
    [ATTRIBUTE_RES3]: '#88cec4',
    [ATTRIBUTE_MAGIC]: '#dbca9a',
    [ATTRIBUTE_CRIT]: '#e2a2a2',
    [ATTRIBUTE_CRAFT]: '#e2a2a2',
    [ATTRIBUTE_XP]: '#d6c2a9',
    [ATTRIBUTE_ITEM]: '#aaa2e2',
    meter: '#1f2437',
  },
  power: {
    [RARITY_COMMON]: '#1b2e39',
    [RARITY_RARE]: '#1a2c37',
    [RARITY_EPIC]: '#2e1a37',
    [RARITY_LEGENDARY]: '#372d1a',
  },
  item: {
    [RARITY_COMMON]: '#0f8355',
    [RARITY_RARE]: '#1f71a8',
    [RARITY_EPIC]: '#6936a1',
    [RARITY_LEGENDARY]: '#d69a00',
    meter: '#9ca6c9',
  },
  rarity: {
    [RARITY_COMMON]: '#00d652',
    [RARITY_RARE]: '#0084d6',
    [RARITY_EPIC]: '#8f00d6',
    [RARITY_LEGENDARY]: '#d68400',
    caster: '#9aafdb',
    meter_border: '#c7ccdc',
    meter: '#9ca6c9',
  },
  legendary: {
    button: 'radial-gradient(circle,  #695b0c 0%, #4d400f 80%)',
    tap: 'radial-gradient(circle,  #856800 0%, #856800 60%)',
    tile: '#856800',
    dark_tile: '#4f4317',
    highlight: '#4f4317',
    texture: '#d6cba9',
    resource: '#d6cba9',
    text: '#dbca9a',
    open: '#5e4c08',
    hover: '#a17e00',
  },
  gold: {
    button: 'radial-gradient(circle,  #695b0c 0%, #4d400f 80%)',
    tap: 'radial-gradient(circle,  #856800 0%, #856800 60%)',
    tile: '#856800',
    dark_tile: '#4f4317',
    highlight: '#4f4317',
    texture: '#d6cba9',
    resource: '#d6cba9',
    text: '#dbca9a',
    open: '#5e4c08',
  },
  [ATTRIBUTE_RES2]: {
    button: 'radial-gradient(circle,  #173a4f 0%, #173a4f 60%)',
    tap: 'radial-gradient(circle,  #1a4261 0%, #1a4261 60%)',
    tile: '#1a4261',
    dark_tile: '#173a4f',
    highlight: '#173a4f',
    texture: '#3392ff',
    resource: '#339cff',
    text: '#9ab8db',
  },
  crafting: {
    button: 'radial-gradient(circle,  #283152 0%, #283152 60%)',
    tap: 'radial-gradient(circle,  #232b43 0%, #232b43 60%)',
    tile: '#232b43',
    dark_tile: '#1f2437',
    highlight: '#1f2437',
    texture: '#8692b1',
    resource: '#8692b1',
    text: '#8692b1',
  },
  [ATTRIBUTE_RES1]: {
    button: 'radial-gradient(circle,  #411e48 0%, #411e48 60%)',
    tap: 'radial-gradient(circle,  #522159 0%, #522159 60%)',
    tile: '#522159',
    dark_tile: '#411e48',
    highlight: '#411e48',
    texture: '#d671ef',
    resource: '#d671ef',
    text: '#d5a2e2',
  },
  [ATTRIBUTE_RES3]: {
    button: 'radial-gradient(circle,  #194332 0%, #194332 60%)',
    tap: 'radial-gradient(circle,  #1c5441 0%, #1c5441 60%)',
    tile: '#1c5441',
    dark_tile: '#194332',
    highlight: '#194332',
    texture: '#29bca6',
    resource: '#29bca6',
    text: '#88cec4',
  },
  element: {
    [ATTRIBUTE_RES2]: '#3392ff',
    [ATTRIBUTE_RES1]: '#d671ef',
    [ATTRIBUTE_RES3]: '#65e7c2',
    legendary: '#d6cba9',
    crafting: '#8692b1',
  },
  textures: {
    [ATTRIBUTE_RES2]: '#3392ff',
    [ATTRIBUTE_RES1]: '#d671ef',
    [ATTRIBUTE_RES3]: '#29bca6',
    crafting: '#8692b1',
    legendary: '#d6cba9',
  },
  tile: {
    [ATTRIBUTE_RES2]: '#1a4261',
    [ATTRIBUTE_RES1]: '#522159',
    [ATTRIBUTE_RES3]: '#1c5441',
    crafting: '#232b43',
    legendary: '#856800',
  },
  button: {
    gold: '#d3b578',
    gold_text: '#563c25',
  },
  loading: {
    gold: '#c6ae6c',
  },
  icons: {
    folder: '#54d4d0',
    search: '#a7adab',
  },
  indent: {
    active: '#7c8ec0',
    level: '#7c8ec0',
    disabled: '#323952',
  },
  highlight: {
    border: '#5f6f95',
    background: '#b2c5eb',
    active: '#425176',
    button: '#425176',
    text: '#fff',
  },
  tap: {
    button_high: 'radial-gradient(circle,  #333c5c 0%, #333c5c 60%)',
    button_shadow_high:
      'inset 1px 1px 8px -2px rgba(236, 240, 254, 0.32), 2px 2px 4px 0 rgba(0, 0, 0, 0.16), 0 0 32px 4px rgba(255, 255, 255, 0.16)',
  },
  interaction: {
    press: 'rgba(84, 212, 208, 0.65)',
  },
  primary: {
    link: '#42c4d1',
    background: '#42c4d1',
    background_active: '#42c4d1',
    text: '#42c4d1',
    text_active: '#42c4d1',
  },
  secondary: {
    background: '#aaacab',
    text: '#aaacab',
    border: '#aaacab',
    solid: '#aaacab',
  },
  background: {
    active: '#425176',
    highest: '#2d3653',
    higher: '#232b43',
    high: '#283152',
    base: '#232b43',
    low: '#232b43',
    lower: '#232b43',
    lowest: '#1f2437',
    bottom: 'rgba(0,0,0,0.16)',
    fade: '#0e111b',
    button: 'radial-gradient(circle,  #232b43 0%, #232b43 60%)',
    button_disabled: 'radial-gradient(circle,  #1f2437 0%, #1f2437 60%)',
    button_low: 'radial-gradient(circle,  #232b43 0%, #232b43 60%)',
    button_high: 'radial-gradient(circle,  #283152 0%, #2d3653 60%)',
    button_active: 'radial-gradient(circle,  #425176 0%, #2d3653 150%)',
    success: '#234334',
    error: '#43233d',
  },
  border: {
    highest: '#5f6f95',
    higher: '#2e3548',
    high: '#3c4667',
    base: '#2e3548',
    low: '#2e3548',
    lower: '#2e3548',
    lowest: '#2e3548',
    success: '#316e30',
    error: '#5d3750',
    divide: '#232b43',
  },
  shadow: {
    popover:
      'inset 2px 2px 4px 0 rgba(236, 240, 254, 0.16), 2px 2px 4px 0 rgba(0, 0, 0, 0.16)',
    card:
      'inset 1px 1px 4px 1px rgba(236, 240, 254, 0.16), 2px 2px 4px 0 rgba(0, 0, 0, 0.16)',
    glass:
      'inset 1px 1px 8px -2px rgba(236, 240, 254, 0.32), 2px 2px 4px 0 rgba(0, 0, 0, 0.16)',
    frost:
      'inset 1px 1px 4px 1px rgba(236, 240, 254, 0.12), 2px 2px 4px 0 rgba(0, 0, 0, 0.12)',
    loading:
      'inset 1px 1px 8px -2px rgba(236, 240, 254, 0.16), 2px 2px 4px 0 rgba(0, 0, 0, 0.12)',
    divider:
      'inset 2px 2px 4px 0 rgba(0,0,0,0.1), inset -1px -1px 2px 0 rgba(255,255,255,0.08)',
    text: '1px 1px 0 rgba(0,0,0,0.4)',
    text_glow: '1px 1px 20px rgba(255,255,255,0.72)',
    button: '2px 2px 4px 0 rgba(0, 0, 0, 0.16)',
    icon: 'inset -4px -4px 8px 0 rgba(0,0,0,0.16)',
    sphere:
      'inset -2px -2px 3px 0 rgba(0,0,0,0.16), 1px 1px 2px 1px rgba(0,0,0,0.16)',
    glow_sphere:
      'inset -2px -2px 3px 0 rgba(0,0,0,0.16), 0 0 8px 2px rgba(255,255,255,0.16), 1px 1px 2px 1px rgba(0,0,0,0.16)',
    cutout: 'inset 2px 2px 4px 0 rgba(0, 0, 0, 0.16)',
    cutout_button:
      'inset 2px 2px 4px 0 rgba(0, 0, 0, 0.16), 2px 2px 4px 0 rgba(0, 0, 0, 0.16)',
    ghost: 'inset 0 0 0 2px #49546f',
    success:
      'inset 1px 1px 4px 1px rgba(100, 247, 178, 0.2), 2px 2px 4px 0 rgba(0, 0, 0, 0.12)',
    error:
      'inset 1px 1px 4px 1px rgba(246, 81, 149, 0.2), 2px 2px 4px 0 rgba(0, 0, 0, 0.12)',
  },
  text: {
    base: '#8692b1',
    faded: '#58627e',
    ghost: '#6d799c',
    active: '#cbcfe2',
    input: '#eaeaea',
    placeholder: '#9d9d9d',
    clear: 'rgba(222,222,255,0.56)',
    tile: '#4e577e',
    alert: '#d2b579',
    success: '#88cec4',
    error: '#c27092',
    logout: '#ba3d57',
    white: '#fff',
  },
  font: {
    open_sauce: 'Open Sauce One',
    red_hat: 'Red Hat Display',
  },
  vendors: {
    fractal: {
      background: '#0c0315',
      text: '#F2059F',
    },
    holaplex: {
      background: '#161616',
      text: '#fff',
    },
  },
  socials: {
    google: '#3f67a6',
    google_hover: '#4175c8',
  },
};
