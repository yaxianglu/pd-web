// API基础URL
const isDevelopment = process.env.NODE_ENV === 'development';

export const API_BASE_URL = isDevelopment
  ? ''
  : (process.env.REACT_APP_API_URL || '');


export const wrapperStyle = {
  width: "100%",
  maxWidth: "1080px",
  margin: "0 auto",
  padding: '80px 0 0 ',
  '@media (max-width: 768px)': {
    padding: '60px 20px'
  }
}

export const cardPaddingStyle = {
  padding: 32,
}

export const cardTitleSizeStyle = {
  fontSize: 22,
  // fontWeight: 500,
  textAlign: 'left',
  marginBottom: 16,
}

export const contactInfoStyle = {
  border: "1.5px solid #dde5ee", borderRadius: "18px", padding: "7px 26px",
  fontSize: 14, color: "#888",
  flex: 1,
  textAlign: "left",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "100%",
  width: "100%",
  display: "inline-block",
  verticalAlign: "middle",
  wordBreak: "break-all",
  cursor: "pointer",
  background: "#fff",
  '@media (max-width: 768px)': {
    fontSize: 12,
  }
}
