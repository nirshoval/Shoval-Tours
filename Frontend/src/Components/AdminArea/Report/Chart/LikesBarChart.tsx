import { BarChart } from '@mui/x-charts/BarChart';
import { VacationModel } from "../../../../Models/VacationModel";

interface LikesBarChartProps {
    vacations: VacationModel[];
}

export function LikesBarChart({ vacations }: LikesBarChartProps) {

    // Get City name of he destination (before comma) for x-axis labels
    const xLabels = vacations.map(v =>
        v.destination?.split(',')[0].trim() || 'Unknown'
    );

    // Get likes count for each vacation
    const likesData = vacations.map(v => v.likesCount || 0);

    return (
        <div className="ChartContainer">
            <BarChart
                height={500}
                series={[
                    {
                        data: likesData,
                        label: 'Likes Count',
                        id: 'likesSeries',
                        color: '#2e40e3ff',
                    }
                ]}
                xAxis={[{
                    scaleType: "band",
                    tickPlacement: 'middle',
                    data: xLabels,
                    tickLabelStyle: { fontSize: 10 },
                }]}
                yAxis={[{
                    tickMinStep: 1,
                    tickLabelStyle: { fontSize: 15 },
                }]}
                grid={{ horizontal: true }}
            />
        </div>
    );
}