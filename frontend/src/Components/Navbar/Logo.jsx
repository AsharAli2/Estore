const StoreLogo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 160 50"
    style={{ height: "40px" }}
  >
    <g>
      {/* Speed lines */}
      <path d="M5 15 L15 15" stroke="#FF3333" strokeWidth="2" />
      <path d="M5 20 L18 20" stroke="#FF3333" strokeWidth="2" />
      <path d="M5 25 L21 25" stroke="#FF3333" strokeWidth="2" />

      {/* 'e' letter */}
      <text
        x="20"
        y="35"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="40"
        fill="#FF3333"
      >
        e
      </text>

      {/* 'store' text */}
      <text
        x="45"
        y="35"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="30"
        fill="#333333"
      >
        store
      </text>
    </g>
  </svg>
);

export default StoreLogo;
