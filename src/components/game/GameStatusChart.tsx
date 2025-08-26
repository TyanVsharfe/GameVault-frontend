import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Box, Typography, Chip } from "@mui/joy";
import {useTranslation} from "react-i18next";

interface UserStats {
    username: string;
    totalGames: number;
    gamesByStatus: Record<string, number>;
    averageRating: number;
    totalNotes: number;
}

const statusColors: Record<string, string> = {
    Playing: "#8b5cf6",
    Completed: "#0d9740",
    Planned: "#c8af1b",
    Abandoned: "#f87171",
    None: "#3a73d8",
};

const statusOrder = ["Playing", "Completed", "Planned", "Abandoned", "None"];

interface Props {
    stats: UserStats;
}

export default function UserStatsChart({ stats }: Props) {
    const { t } = useTranslation();
    const total = stats.totalGames || 1;

    const data = statusOrder.map((status) => ({
        name: status,
        value: stats.gamesByStatus[status] || 0,
        color: statusColors[status] || "#999",
    }));

    return (
        <Box style={{ width: "60rem", margin: 'auto'}}>
            <Typography level="h4" className="text-lg font-semibold mb-2">
                {stats.username}'s Game Status
            </Typography>

            <ResponsiveContainer width="100%" height={40}>
                <BarChart layout="vertical" data={[{ name: t('status'), ...Object.fromEntries(data.map(d => [t(`status_${d.name.toLowerCase()}`), d.value])) }]}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip />
                    {data.map((entry) => (
                        <Bar
                            key={entry.name}
                            dataKey={t(`status_${entry.name.toLowerCase()}`)}
                            stackId="a"
                            fill={entry.color}
                            isAnimationActive={false}
                        />
                    ))}
                </BarChart>
            </ResponsiveContainer>

            <Box className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {data.map((entry) => {
                    const percent = Math.round((entry.value / total) * 100);
                    return (
                        <Box key={entry.name}>
                            <Typography level="body-md" fontWeight="lg" style={{padding: '0.5rem'}}>
                                <Chip size="lg" style={{color:entry.color}}>
                                    {t(`status_${entry.name.toLowerCase()}`)}
                                </Chip>
                                <Typography style={{paddingLeft: '0.5rem'}}>{t('games')}: {entry.value}</Typography>
                                <Typography textColor="neutral.400" style={{paddingLeft: '0.8rem'}}>
                                    {percent}%
                                </Typography>
                            </Typography>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}
