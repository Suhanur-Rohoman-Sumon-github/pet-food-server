export const extractPrismaErrorMessage = (message: string): string => {
  const match = message.match(/Argument `(.*?)` is missing/)
  return match ? `Argument ${match[1]} is missing.` : 'A Prisma error occurred.'
}
