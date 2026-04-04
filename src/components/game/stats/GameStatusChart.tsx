import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import {Box, Typography, Chip, Stack} from "@mui/joy";
import {useTranslation} from "react-i18next";
import {useTheme} from "next-themes";
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import CircleIcon from '@mui/icons-material/Circle';

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
        <Box style={{ maxWidth: '45rem'}}
             sx={{
                 p: 0.5,
                 gap: 0.5,
                 margin: 2,
                 borderRadius: 'xl',
             }}
        >
            <Typography level="h4" className="text-lg font-semibold mb-2">
                <SignalCellularAltIcon/> {stats.username}'s Game Status
            </Typography>

            <ResponsiveContainer width="100%" height={40}>
                <BarChart layout="vertical"
                          data={[{name: t('status'),
                              ...Object.fromEntries(data.map(d =>
                                  [t(`status_${d.name.toLowerCase()}`), d.value])) }]}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" hide />
                    <Tooltip />
                    {data.map((entry, index) => {
                        const isFirst = index === 0
                        const isLast = index === data.length - 1

                        return (
                            <Bar
                                key={entry.name}
                                dataKey={t(`status_${entry.name.toLowerCase()}`)}
                                stackId="a"
                                fill={entry.color}
                                radius={
                                    isFirst ? [8, 0, 0, 8] :
                                        isLast  ? [0, 8, 8, 0] :
                                            [0, 0, 0, 0]
                                }
                                isAnimationActive={false}
                            />
                        )
                    })}
                </BarChart>
            </ResponsiveContainer>

            <Stack direction="row" className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {data.map((entry) => {
                    const percent = Math.round((entry.value / total) * 100);
                    return (
                        <Box key={entry.name}>
                            <Stack style={{padding: '0.5rem', width: '7.5rem'}} gap={0.25}>
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                >
                                    <CircleIcon
                                        style={{ color: entry.color, fontSize: '0.85rem', marginRight: '0.25rem',}}
                                    />
                                    <Typography level="title-sm" sx={{margin: 0, height: '0.95rem'}}>
                                        {t(`status_${entry.name.toLowerCase()}`)}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" alignItems="end">
                                    <Typography level="h4" sx={{margin: 0, lineHeight: 1.3}}>{entry.value}</Typography>
                                    <Typography level="body-sm" textColor="neutral.400" style={{paddingLeft: '0.6rem', fontSize: '0.8rem'}}>
                                        {percent}%
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
}
