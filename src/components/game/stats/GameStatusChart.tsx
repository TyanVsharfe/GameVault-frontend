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
import {useTheme} from "next-themes";

interface UserStats {
    username: string;
    totalGames: number;
    gamesByStatus: Record<string, number>;
    averageRating: number;
    totalNotes: number;
}

const statusColors: Record<string, string> = {
    playing: "#8b5cf6",
    completed: "#0d9740",
    planned: "#c8af1b",
    abandoned: "#f87171",
    none: "#3a73d8",
};

const statusOrder = ["playing", "completed", "planned", "abandoned", "none"];

interface Props {
    stats: UserStats;
}

export default function UserStatsChart({ stats }: Props) {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const total = stats.totalGames || 1;

    const data = statusOrder.map((status) => ({
        name: status,
        value: stats.gamesByStatus[status] || 0,
        color: statusColors[status] || "#999",
    }));

    return (
        <Box style={{ width: "60rem"}}
             sx={{
                 p: 0.5,
                 gap: 0.5,
                 margin: 2,
                 borderRadius: 'xl',
                 bgcolor: theme === 'dark' ? 'background.level3' : 'background.level1',
             }}
        >
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
                                    {t(`status_${entry.name.toLowerCase()}`)}:
                                </Chip>
                                <Typography style={{}}>{entry.value}</Typography>
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
