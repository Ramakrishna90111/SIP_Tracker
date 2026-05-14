import express from "express";
import cors from "cors";

import investorRoutes from "./routes/investorRoute";
import fundRoutes from "./routes/fundRoute";
import sipRoutes from "./routes/sipRoute";
import portfolioRoutes from "./routes/portfolioRoute";

const app = express();

app.use(cors({
    origin: "http://localhost:2207",
    credentials: true
}));

app.use(express.json());

app.use("/api/investor", investorRoutes);
app.use("/api/fund", fundRoutes);
app.use("/api/sip", sipRoutes);
app.use("/api/portfolio", portfolioRoutes);

app.listen(3000, () => {
    console.log("Server started");
});
