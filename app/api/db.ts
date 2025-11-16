import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, condominios, moradores, prestadores, servicos, avaliacoes, assembleias, pagamentos } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Condominios
export async function getCondominioById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(condominios).where(eq(condominios.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCondominiosByAdministradora(administradoraId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(condominios).where(eq(condominios.administradoraId, administradoraId));
}

// Moradores
export async function getMoradorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(moradores).where(eq(moradores.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getMoradoresByCondominio(condominioId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(moradores).where(eq(moradores.condominioId, condominioId));
}

export async function getMoradorByUserAndCondominio(userId: number, condominioId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(moradores)
    .where(and(eq(moradores.userId, userId), eq(moradores.condominioId, condominioId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Prestadores
export async function getPrestadorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(prestadores).where(eq(prestadores.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPrestadorByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(prestadores).where(eq(prestadores.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPrestadoresByCategory(category: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(prestadores).where(eq(prestadores.category, category));
}

// Servicos
export async function getServicoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(servicos).where(eq(servicos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getServicosByPrestador(prestadorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(servicos)
    .where(eq(servicos.prestadorId, prestadorId))
    .orderBy(desc(servicos.createdAt));
}

export async function getServicosByMorador(moradorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(servicos)
    .where(eq(servicos.moradorId, moradorId))
    .orderBy(desc(servicos.createdAt));
}

// Avaliacoes
export async function getAvaliacoesByPrestador(prestadorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(avaliacoes)
    .where(eq(avaliacoes.prestadorId, prestadorId))
    .orderBy(desc(avaliacoes.createdAt));
}

export async function getAvaliacaoByServicoId(servicoId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(avaliacoes).where(eq(avaliacoes.servicoId, servicoId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Assembleias
export async function getAssembleiasByCondominio(condominioId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(assembleias)
    .where(eq(assembleias.condominioId, condominioId))
    .orderBy(desc(assembleias.scheduledDate));
}

// Pagamentos
export async function getPagamentosByMorador(moradorId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(pagamentos)
    .where(eq(pagamentos.moradorId, moradorId))
    .orderBy(desc(pagamentos.dueDate));
}

export async function getPagamentosByCondominio(condominioId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(pagamentos)
    .where(eq(pagamentos.condominioId, condominioId))
    .orderBy(desc(pagamentos.dueDate));
}
