import React from "react";
import { Box, Typography } from "@mui/joy";

export default function DlcBadge({size = "default"}: {size: string}) {
    return (
        <Box
            sx={{
                position: "absolute",
                top: size === "default" ? 7 : 5,
                left: 8,
                px: 1.5,
                borderRadius: "1rem",
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.25)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
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
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: `${size === "default" ? 0.95 : 0.75}rem`,
                    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                }}
            >
                DLC
            </Typography>
    </Box>
    );
}

