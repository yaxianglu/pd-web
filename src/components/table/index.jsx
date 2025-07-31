import './index.scss';

const tableData = [
  {
    k1: "臋蠿昷橉",
    k2: "蓭澐媽咷",
    k3: "NT$11,000"
  },
  {
    k1: "3入組", 
    k2: "NT$14,000",
    k3: "NT$14,000"
  },
  {
    k1: "5入組",
    k2: "NT$16,000",
    k3: "NT$16,000"
  }
];

export default function Table({ list }) {
  return (
    <div className="table-container">
      {list.map((item, index) => (
        <div className="table-row" key={index}>
          <div className="table-cell table-cell-1">{item.k1}</div>
          <div className="table-cell table-cell-3">{item.k2}</div>
          <div className="table-cell table-cell-1">{item.k3}</div>
        </div>
      ))}
    </div>
  );
}