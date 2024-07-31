import React, { FC } from 'react';
import { format } from 'date-fns';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Tooltip,
	PointElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, Tooltip);

export const options = {
	responsive: true,
	borderLeftWidth: 2,
	borderRightWidth: 2,
	borderColor: 'rgba(255,255,255,0)',
	inflateAmount: 0,
	scales: {
		x: {
			ticks: {
				display: false,
				color: '#A5A5BA',
				maxTicksLimit: 0,
				maxRotation: 0,
				minRotation: 0,
			},
			grid: {
				display: false,
			},
		},
		y: {
			grid: {
				display: false,
			},
		},
	},
};

interface IChartVerticalProps {
	dataChart?: Array<number>;
	period?: string;
}

export const ChartVertical: FC<IChartVerticalProps> = ({ dataChart = [4,6,1,8], period }) => {
	const labels = [4,6,1,8];

	// idx === 0 || idx % 4 === 0 ? format(new Date(el.time), 'hh:mm aa') : '',
	const data = {
		labels,
		datasets: [
			{
				data: dataChart,
				backgroundColor: 'rgba(40,184,102, 1)',
			},
		],
	};
	return dataChart && <Bar options={options} data={data} />;
};
