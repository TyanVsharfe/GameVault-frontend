import React from "react";
import { Box, Typography } from "@mui/joy";
import { getRatingColor } from "../../../utils/Utils";

export default function RatingBadge({ rating, size = "default" }: { rating: number, size: string }) {
    const color = getRatingColor(rating);

    return (
        <Box
            sx={{
                position: "absolute",
                top: size === "default" ? 7 : 5,
                right: 8,
                px: 1.5,
                borderRadius: "1rem",
                background: color,
                border: `1px solid ${color}`,
                backdropFilter: "blur(10px) saturate(1.05)",
                WebkitBackdropFilter: "blur(10px) saturate(1.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                zIndex: 2,
            }}
        >
            <Typography
                level="body-md"
                sx={{
                    position: "relative",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: `${size === "default" ? 0.95 : 0.75}rem`,
                    textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                    zIndex: 1,
                }}
            >
                {rating ? Math.round(rating) : null}
            </Typography>
        </Box>
    );
}
