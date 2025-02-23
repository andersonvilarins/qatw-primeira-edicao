import { Queue } from "bullmq";

const connection = {
    host: 'paybank-redis',
    port: 6379

}

const queueName = 'twoFactorQueue'

const queue = new Queue(queueName, { connection })

export const getJob = async () => {
    const jobs = await queue.getJobs()   //função que busca todos os jobs
    // console.log(jobs[0].data.code)
    return jobs[0].data.code
}

export const cleanJobs = async () => {
    await queue.obliterate({ force:true })      // função que limpa a fila do redis 
}