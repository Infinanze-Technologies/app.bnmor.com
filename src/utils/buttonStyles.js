/**
 * Button Style Utilities
 * 
 * This file contains reusable button styling functions for consistent
 * button appearance across the KLSM Suite application.
 */

// Color constants
export const COLORS = {
  PRIMARY: 'linear-gradient(135deg, #4D4D4D 0%, #6B6B6B 100%)',        // Dark Gray
  PRIMARY_HOVER: '#3A3A3A',  // Darker Gray
  ACCENT: '#8B8B8B',         // Medium Gray
  ACCENT_HOVER: '#7A7A7A',   // Darker Medium Gray
  SECONDARY: '#6B6B6B',      // Light Gray
  SECONDARY_HOVER: '#5B5B5B', // Darker Light Gray
  WHITE: '#ffffff',
  BORDER_LIGHT: 'rgba(77, 77, 77, 0.2)'
};

/**
 * Creates primary button styles (Dark Gray)
 * @param {Object} options - Additional style options
 * @returns {Object} Button style object
 */
export const getPrimaryButtonStyles = (options = {}) => {
  const defaultStyles = {
    background: COLORS.PRIMARY,
    border: 'none',
    color: COLORS.WHITE,
    borderRadius: '8px',
    fontWeight: '500',
    boxShadow: `0 2px 8px rgba(77, 77, 77, 0.3)`,
    transition: 'all 0.3s ease',
    ...options
  };

  return {
    style: defaultStyles,
    onMouseEnter: (e) => {
      e.currentTarget.style.background = COLORS.PRIMARY_HOVER;
      e.currentTarget.style.borderColor = COLORS.PRIMARY_HOVER;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = COLORS.PRIMARY;
      e.currentTarget.style.borderColor = COLORS.PRIMARY;
    }
  };
};

/**
 * Creates accent button styles (Medium Gray)
 * @param {Object} options - Additional style options
 * @returns {Object} Button style object
 */
export const getAccentButtonStyles = (options = {}) => {
  const defaultStyles = {
    background: COLORS.ACCENT,
    border: 'none',
    color: COLORS.WHITE,
    borderRadius: '8px',
    fontWeight: '500',
    boxShadow: `0 2px 8px rgba(139, 139, 139, 0.3)`,
    transition: 'all 0.3s ease',
    ...options
  };

  return {
    style: defaultStyles,
    onMouseEnter: (e) => {
      e.currentTarget.style.background = COLORS.ACCENT_HOVER;
      e.currentTarget.style.borderColor = COLORS.ACCENT_HOVER;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = COLORS.ACCENT;
      e.currentTarget.style.borderColor = COLORS.ACCENT;
    }
  };
};

/**
 * Creates secondary button styles (Light Gray)
 * @param {Object} options - Additional style options
 * @returns {Object} Button style object
 */
export const getSecondaryButtonStyles = (options = {}) => {
  const defaultStyles = {
    background: COLORS.SECONDARY,
    border: 'none',
    color: COLORS.WHITE,
    borderRadius: '8px',
    fontWeight: '500',
    boxShadow: `0 2px 8px rgba(107, 107, 107, 0.3)`,
    transition: 'all 0.3s ease',
    ...options
  };

  return {
    style: defaultStyles,
    onMouseEnter: (e) => {
      e.currentTarget.style.background = COLORS.SECONDARY_HOVER;
      e.currentTarget.style.borderColor = COLORS.SECONDARY_HOVER;
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = COLORS.SECONDARY;
      e.currentTarget.style.borderColor = COLORS.SECONDARY;
    }
  };
};

/**
 * Creates outline button styles (White with Gray border)
 * @param {Object} options - Additional style options
 * @returns {Object} Button style object
 */
export const getOutlineButtonStyles = (options = {}) => {
  const defaultStyles = {
    background: COLORS.WHITE,
    border: `1px solid #4D4D4D`,
    color: '#4D4D4D',
    borderRadius: '8px',
    fontWeight: '500',
    boxShadow: `0 2px 8px rgba(77, 77, 77, 0.1)`,
    transition: 'all 0.3s ease',
    ...options
  };

  return {
    style: defaultStyles,
    onMouseEnter: (e) => {
      e.currentTarget.style.background = '#4D4D4D';
      e.currentTarget.style.color = COLORS.WHITE;
      e.currentTarget.style.borderColor = '#4D4D4D';
    },
    onMouseLeave: (e) => {
      e.currentTarget.style.background = COLORS.WHITE;
      e.currentTarget.style.color = '#4D4D4D';
      e.currentTarget.style.borderColor = '#4D4D4D';
    }
  };
};

/**
 * Creates a styled button component with consistent styling
 * @param {string} variant - Button variant ('primary', 'accent', 'secondary', 'outline')
 * @param {Object} options - Additional style options
 * @returns {Object} Complete button props object
 */
export const createStyledButton = (variant = 'primary', options = {}) => {
  const buttonType = 'default'; // Always use default to avoid Ant Design overrides
  
  switch (variant.toLowerCase()) {
    case 'primary':
      return {
        type: buttonType,
        ...getPrimaryButtonStyles(options)
      };
    case 'accent':
      return {
        type: buttonType,
        ...getAccentButtonStyles(options)
      };
    case 'secondary':
      return {
        type: buttonType,
        ...getSecondaryButtonStyles(options)
      };
    case 'outline':
      return {
        type: buttonType,
        ...getOutlineButtonStyles(options)
      };
    default:
      return {
        type: buttonType,
        ...getPrimaryButtonStyles(options)
      };
  }
};

/**
 * Pre-configured button variants for common use cases
 */
export const BUTTON_VARIANTS = {
  // Primary actions (Create, Add, Save) - Dark Gray
  PRIMARY: (options = {}) => createStyledButton('primary', options),
  
  // Accent actions (Search, Filter) - Medium Gray
  ACCENT: (options = {}) => createStyledButton('accent', options),
  
  // Success actions (Apply, Confirm) - Light Gray
  SUCCESS: (options = {}) => createStyledButton('secondary', options),
  
  // Secondary actions (Cancel, Clear) - Outline Gray
  SECONDARY: (options = {}) => createStyledButton('outline', options),
  
  // Custom size variants
  SMALL: (variant = 'primary', options = {}) => 
    createStyledButton(variant, { 
      height: '28px', 
      padding: '0 12px', 
      fontSize: '12px',
      ...options 
    }),
  
  LARGE: (variant = 'primary', options = {}) => 
    createStyledButton(variant, { 
      height: '48px', 
      padding: '0 24px', 
      fontSize: '16px',
      ...options 
    }),
  
  ICON_ONLY: (variant = 'primary', options = {}) => 
    createStyledButton(variant, { 
      width: '40px', 
      height: '40px', 
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      ...options 
    })
};

/**
 * Common button configurations
 */
export const BUTTON_CONFIGS = {
  ADD_BUTTON: () => BUTTON_VARIANTS.PRIMARY({
    borderRadius: '8px',
    fontWeight: '500'
  }),
  
  SEARCH_BUTTON: () => BUTTON_VARIANTS.PRIMARY({
    borderRadius: '0 12px 12px 0',
    width: '50px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  
  APPLY_BUTTON: () => BUTTON_VARIANTS.PRIMARY({
    borderRadius: '10px',
    height: '36px',
    fontWeight: '600'
  }),
  
  CLEAR_BUTTON: () => BUTTON_VARIANTS.SECONDARY({
    borderRadius: '10px',
    height: '36px',
    fontWeight: '500'
  }),
  
  SAVE_BUTTON: () => BUTTON_VARIANTS.PRIMARY({
    borderRadius: '8px',
    height: '40px',
    fontWeight: '600',
    padding: '0 24px'
  }),
  
  CANCEL_BUTTON: () => BUTTON_VARIANTS.SECONDARY({
    borderRadius: '8px',
    height: '40px',
    fontWeight: '500',
    padding: '0 24px'
  }),
  
  SUBMIT_BUTTON: () => BUTTON_VARIANTS.PRIMARY({
    borderRadius: '8px',
    height: '40px',
    fontWeight: '600',
    padding: '0 24px'
  }),
  
  // Additional button configurations for common variants
  PRIMARY: (options = {}) => BUTTON_VARIANTS.PRIMARY(options),
  ACCENT: (options = {}) => BUTTON_VARIANTS.ACCENT(options),
  SUCCESS: (options = {}) => BUTTON_VARIANTS.SUCCESS(options),
  SECONDARY: (options = {}) => BUTTON_VARIANTS.SECONDARY(options)
};
