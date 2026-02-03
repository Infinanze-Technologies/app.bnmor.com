const primaryColor = '#4D4D4D';
const primaryHover = '#4347D9';
const secondaryColor = '#FF69A5';
const secondaryHover = '#E34A87';
const linkColor = '#1890ff';
const linkHover = '#0D79DF';
const headingColor = 'rgba(0, 0, 0, 0.85)';
const successColor = '#20C997';
const successHover = '#0CAB7C';
const warningColor = '#FA8B0C';
const warningHover = '#D47407';
const errorColor = '#f5222d';
const errorHover = '#E30D0F';
const infoColor = '#2C99FF';
const infoHover = '#0D79DF';
const darkColor = '#272B41';
const darkHover = '#131623';
const grayColor = '#5A5F7D';
const grayHover = '#363A51';
const lightColor = '#9299B8';
const lightHover = '#e2e6ea';
const whiteColor = '#ffffff';
const dashColor = '#E3E6EF';
const whiteHover = '#5A5F7D';
const extraLightColor = '#ADB4D2';
const dangerColor = '#FF4D4F';
const dangerHover = '#E30D0F';
const borderColorLight = '#F1F2F6';
const borderColorNormal = '#E3E6EF';
const borderColorDeep = '#C6D0DC';
const bgGrayColorDeep = '#EFF0F3';
const bgGrayColorLight = '#F8F9FB';
const bgGrayColorNormal = '#F4F5F7';
const lightGrayColor = '#868EAE';
const sliderRailColor = 'rgba(95,99,242,0.2)';
const graySolid = '#9299b8';
const pinkColor = '#F63178';
const btnlg = '48px';
const btnsm = '36px';
const btnxs = '29px';

const theme = {
  token: {
    colorPrimary: primaryColor,
    colorSuccess: successColor,
    colorWarning: warningColor,
    colorError: errorColor,
    colorInfo: infoColor,
    colorTextBase: darkColor,
    colorBgBase: whiteColor,
    fontFamily: "'Inter', sans-serif",
    fontSize: 14,
    borderRadius: 4,
    wireframe: false,
  },
  components: {
    Button: {
      controlHeightLG: parseInt(btnlg),
      controlHeight: parseInt(btnsm),
      controlHeightSM: parseInt(btnxs),
      colorPrimary: primaryColor,
      colorPrimaryHover: primaryHover,
      algorithm: true,
    },
    Card: {
      colorBgContainer: '#ffffff',
      padding: 12,
      borderRadiusLG: 10,
      boxShadow: '0 5px 20px rgba(146,153,184,0.03)',
    },
    Layout: {
      colorBgBody: '#F4F5F7',
      colorBgHeader: '#ffffff',
      colorBgFooter: '#fafafa',
      headerHeight: 64,
      headerPadding: '0 15px',
      footerPadding: '24px 15px',
    },
    Input: {
      controlHeight: 48,
      controlHeightSM: 30,
      controlHeightLG: 50,
      colorBorder: borderColorNormal,
    },
    Radio: {
      colorPrimary: primaryColor,
    },
    Switch: {
      colorPrimary: primaryColor,
    },
    Tag: {
      colorBgContainer: '#EFF0F3',
      colorText: darkColor,
      fontSize: 11,
    },
    Alert: {
      colorSuccessBg: `${successColor}15`,
      colorErrorBg: `${errorColor}15`,
      colorWarningBg: `${warningColor}15`,
      colorInfoBg: `${infoColor}15`,
    },
  },
};

const darkTheme = {
  ...theme,
  token: {
    ...theme.token,
    colorPrimary: 'red',
    colorBgBase: '#000',
  },
};

export { theme, darkTheme };
