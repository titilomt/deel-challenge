import {
  getAllUnpaidJobsService,
  postPaymentJobService,
} from "../application/index.js";

const getAllUnpaidJobs = async (req, res) => {
  const { id: profileId, type } = req.profile;

  try {
    const jobs = await getAllUnpaidJobsService({ profileId, type });

    if (!jobs) return res.status(404).end();

    return res.status(200).send(jobs);
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

const postPaymentJob = async (req, res) => {
  const { id: profileId, type } = req.profile;
  const { job_id } = req.params;
  try {
    const jobMessage = await postPaymentJobService(parseInt(job_id), {
      profileId,
      type,
    });

    if (!jobMessage) return res.status(404).end();

    return res.status(200).send({ message: jobMessage });
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
};

export { getAllUnpaidJobs, postPaymentJob };
