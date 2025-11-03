import Appointment from '../models/Appointment.js';
import Article from '../models/Article.js';
import HealthDeclaration from '../models/HealthDeclaration.js';
import Service from '../models/Service.js';

export const getAdminStats = async (req, res, next) => {
    try {
        const now = new Date();
        const from30d = new Date(now);
        from30d.setDate(from30d.getDate() - 30);

        // Counts
        const [appointmentsTotal, appointmentsByStatus, articlesTotal, declarationsTotal, activeServices] = await Promise.all([
            Appointment.countDocuments({}),
            Appointment.aggregate([
                { $group: { _id: '$status', count: { $sum: 1 } } }
            ]),
            Article.countDocuments({}),
            HealthDeclaration.countDocuments({}),
            Service.countDocuments({ active: true })
        ]);

        // Time series for last 30 days (appointments per day)
        const timeseries = await Appointment.aggregate([
            { $match: { date: { $gte: from30d } } },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$date' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top services by appointments (last 90 days)
        const from90d = new Date(now);
        from90d.setDate(from90d.getDate() - 90);
        const topServicesAgg = await Appointment.aggregate([
            { $match: { date: { $gte: from90d }, serviceType: { $ne: null } } },
            { $group: { _id: '$serviceType', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Populate service names
        const serviceIds = topServicesAgg.map(s => s._id);
        const servicesMap = new Map(
            (await Service.find({ _id: { $in: serviceIds } }).select('name_he name_en'))
                .map(s => [s._id.toString(), s])
        );
        const topServices = topServicesAgg.map(s => ({
            serviceId: s._id,
            name_he: servicesMap.get(s._id.toString())?.name_he || 'ללא שם',
            name_en: servicesMap.get(s._id.toString())?.name_en || 'Unnamed',
            count: s.count
        }));

        res.json({
            success: true,
            data: {
                counts: {
                    appointments: appointmentsTotal,
                    appointmentsByStatus: appointmentsByStatus.reduce((acc, cur) => {
                        acc[cur._id || 'unknown'] = cur.count; return acc;
                    }, {}),
                    articles: articlesTotal,
                    healthDeclarations: declarationsTotal,
                    activeServices
                },
                timeseries,
                topServices
            }
        });
    } catch (error) {
        next(error);
    }
};


