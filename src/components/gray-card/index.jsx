import React from "react";
import './index.scss';
import CardWrapper from "../card-wrapper";

export default function GrayCard({ children, title, description }) {
  return (
    <CardWrapper>
      <div className="gray-card-wrapper">
        <div className="gray-card-title">{title}</div>
        <div className="gray-card-description">
          {description}
        </div>
        {children}
      </div>
    </CardWrapper>
  );
}
