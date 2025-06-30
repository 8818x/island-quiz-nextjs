import React from "react";

interface CircularScoreProps {
	score: number;
	maxScore?: number;
	size?: number;
	strokeWidth?: number;
}

const CircularScore: React.FC<CircularScoreProps> = ({
	score,
	maxScore = 10,
	size = 120,
	strokeWidth = 12
}) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const percent = Math.min(Math.max(score / maxScore, 0), 1);
	const offset = circumference * (1 - percent);

	const { color, label } = (() => {
		if (score >= 8) return { color: "green", label: "Excellent" };
		else if (score >= 5) return { color: "orange", label: "Pass" };
		return { color: "red", label: "Fail" };
	})();

	return (
		<div className="inline-flex flex-col items-center">
			<svg width={size} height={size}>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke="#eee"
					strokeWidth={strokeWidth}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={radius}
					fill="none"
					stroke={color}
					strokeDasharray={circumference}
					strokeDashoffset={offset}
					strokeLinecap="round"
					strokeWidth={strokeWidth}
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
				/>
				<text
					x="50%"
					y="50%"
					dy=".3em"
					textAnchor="middle"
					fontSize={size * 0.24}
					fill="#333"
					fontWeight="bold"
				>
					{score}/{maxScore}
				</text>
			</svg>
			<span className={`mt-2 text-sm font-light text-${color}`}>
				Result : {label}
			</span>
		</div>
	);
};

export default CircularScore;
