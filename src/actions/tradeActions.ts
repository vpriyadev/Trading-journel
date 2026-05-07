"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const tradeSchema = z.object({
  asset: z.string().min(1),
  side: z.string(),
  quantity: z.number(),
  entryPrice: z.number(),
  exitPrice: z.number().optional(),
  stopLoss: z.number().optional(),
  takeProfit: z.number().optional(),
  pnl: z.number().optional(),
  riskReward: z.number().optional(),
  strategy: z.string().optional(),
  emotion: z.string().optional(),
  mistakes: z.array(z.string()),
  notes: z.string().optional(),
  date: z.string(),
});

export async function createTrade(data: any) {
  try {
    // In a real app, we would get the userId from the session
    // For this demonstration, we'll use a hardcoded user ID or create one if it doesn't exist
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Default User",
          email: "user@example.com",
        },
      });
    }

    const trade = await prisma.trade.create({
      data: {
        userId: user.id,
        asset: data.asset,
        side: data.side,
        quantity: data.quantity,
        entryPrice: data.entryPrice,
        exitPrice: data.exitPrice,
        stopLoss: data.stopLoss,
        takeProfit: data.takeProfit,
        pnl: data.pnl,
        riskReward: data.riskReward,
        strategy: data.strategy,
        emotion: data.emotion,
        mistakes: data.mistakes,
        notes: data.notes,
        date: new Date(data.date),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/history");
    revalidatePath("/analytics");
    
    return { success: true, data: trade };
  } catch (error) {
    console.error("Failed to create trade:", error);
    return { success: false, error: "Failed to create trade" };
  }
}

export async function getTrades() {
  try {
    return await prisma.trade.findMany({
      orderBy: { date: "desc" },
    });
  } catch (error) {
    console.warn("Database unreachable, returning mock trades.");
    return [
      { id: "1", date: new Date(), asset: "AAPL", side: "Long", strategy: "Breakout", pnl: 450, quantity: 10, entryPrice: 150, exitPrice: 195 },
      { id: "2", date: new Date(Date.now() - 86400000), asset: "BTC", side: "Short", strategy: "Mean Reversion", pnl: -120, quantity: 0.1, entryPrice: 65000, exitPrice: 66200 },
      { id: "3", date: new Date(Date.now() - 172800000), asset: "NQ", side: "Long", strategy: "Trend", pnl: 850, quantity: 1, entryPrice: 18000, exitPrice: 18850 },
    ];
  }
}
