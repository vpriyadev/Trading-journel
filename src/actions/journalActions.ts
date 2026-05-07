"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createJournalEntry(data: {
  title: string;
  notes: string;
  mood: string;
}) {
  try {
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: {
          name: "Default User",
          email: "user@example.com",
        },
      });
    }

    const entry = await prisma.journalEntry.create({
      data: {
        userId: user.id,
        title: data.title,
        notes: data.notes,
        mood: data.mood,
      },
    });

    revalidatePath("/journal");
    return { success: true, data: entry };
  } catch (error) {
    console.error("Failed to create journal entry:", error);
    return { success: false, error: "Failed to create journal entry" };
  }
}

export async function getJournalEntries() {
  try {
    return await prisma.journalEntry.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.warn("Database unreachable, returning empty journal.");
    return [];
  }
}
