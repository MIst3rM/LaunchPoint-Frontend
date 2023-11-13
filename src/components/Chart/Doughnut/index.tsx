import { motion } from 'framer-motion';

const DoughnutChart = ({ radius, thickness, startAngle, endAngle, color }) => {
    const size = 2 * (radius + thickness);
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (startAngle / 360) * circumference;
    const strokeDasharray = ((endAngle - startAngle) / 360) * circumference + ' ' + circumference;

    const pathProps = {
        d: `
        M ${size / 2}, ${size / 2}
        m ${-radius}, 0
        a ${radius},${radius} 0 1,1 ${radius * 2},0
        a ${radius},${radius} 0 1,1 ${-radius * 2},0
        `,
        stroke: color,
        strokeWidth: thickness,
        fill: 'none',
        strokeDasharray,
        strokeDashoffset,
    };

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <motion.path
                {...pathProps}
                initial={{ strokeDashoffset }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2, ease: "easeInOut" }}
            />
        </svg>
    );
};

export default DoughnutChart;
