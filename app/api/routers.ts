import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // User Profile
  user: router({
    profile: protectedProcedure.query(async ({ ctx }) => {
      const user = await db.getUserByOpenId(ctx.user.openId);
      return user;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        name: z.string().optional(),
        userType: z.enum(["morador", "administradora", "prestador"]).optional(),
        phone: z.string().optional(),
        document: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        zipCode: z.string().optional(),
        avatar: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Update user profile in database
        // This would require implementing an update function in db.ts
        return { success: true };
      }),
  }),

  // Condominios
  condominio: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getCondominioById(input.id);
      }),
    getByAdministradora: protectedProcedure.query(async ({ ctx }) => {
      // Get user's prestador profile if exists
      return await db.getCondominiosByAdministradora(ctx.user.id);
    }),
  }),

  // Moradores
  morador: router({
    getByCondominio: publicProcedure
      .input(z.object({ condominioId: z.number() }))
      .query(async ({ input }) => {
        return await db.getMoradoresByCondominio(input.condominioId);
      }),
    getByUserAndCondominio: protectedProcedure
      .input(z.object({ condominioId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getMoradorByUserAndCondominio(ctx.user.id, input.condominioId);
      }),
  }),

  // Prestadores
  prestador: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getPrestadorById(input.id);
      }),
    getByCategory: publicProcedure
      .input(z.object({ category: z.string() }))
      .query(async ({ input }) => {
        return await db.getPrestadoresByCategory(input.category);
      }),
    getMyProfile: protectedProcedure.query(async ({ ctx }) => {
      return await db.getPrestadorByUserId(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        businessName: z.string(),
        description: z.string().optional(),
        category: z.string(),
        profileImage: z.string().optional(),
        yearsExperience: z.number().optional(),
        certifications: z.string().optional(),
        serviceArea: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Create prestador profile
        return { success: true };
      }),
  }),

  // Serviços
  servico: router({
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await db.getServicoById(input.id);
      }),
    getByPrestador: publicProcedure
      .input(z.object({ prestadorId: z.number() }))
      .query(async ({ input }) => {
        return await db.getServicosByPrestador(input.prestadorId);
      }),
    getByMorador: protectedProcedure.query(async ({ ctx }) => {
      // Get morador ID from context
      return [];
    }),
    create: protectedProcedure
      .input(z.object({
        condominioId: z.number(),
        prestadorId: z.number(),
        description: z.string(),
        category: z.string(),
        estimatedPrice: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Create servico
        return { success: true };
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        servicoId: z.number(),
        status: z.enum(["pendente", "aceito", "em_progresso", "concluido", "cancelado"]),
      }))
      .mutation(async ({ ctx, input }) => {
        // Update servico status
        return { success: true };
      }),
  }),

  // Avaliações
  avaliacao: router({
    getByPrestador: publicProcedure
      .input(z.object({ prestadorId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAvaliacoesByPrestador(input.prestadorId);
      }),
    getByServico: publicProcedure
      .input(z.object({ servicoId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAvaliacaoByServicoId(input.servicoId);
      }),
    create: protectedProcedure
      .input(z.object({
        servicoId: z.number(),
        prestadorId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
        positives: z.string().optional(),
        negatives: z.string().optional(),
        wouldRecommend: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Create avaliacao
        return { success: true };
      }),
  }),

  // Assembleias
  assembleia: router({
    getByCondominio: publicProcedure
      .input(z.object({ condominioId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAssembleiasByCondominio(input.condominioId);
      }),
  }),

  // Pagamentos
  pagamento: router({
    getByMorador: protectedProcedure.query(async ({ ctx }) => {
      // Get morador ID and fetch pagamentos
      return [];
    }),
    getByCondominio: publicProcedure
      .input(z.object({ condominioId: z.number() }))
      .query(async ({ input }) => {
        return await db.getPagamentosByCondominio(input.condominioId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
