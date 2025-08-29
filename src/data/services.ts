export interface ServicesUnit{
    serviceName: string;
    serviceDescription: string;
    imageUrl: string;
}


export const Services: ServicesUnit[] = [
    {
        serviceName: "Agritech Solutions",
        serviceDescription: "Description for Agritech Solutions",
        imageUrl: "/projects/ctd.jpg"
    },
    {
        serviceName: "Early Warning Systems",
        serviceDescription: "Description for Early Warning Systems 2",
        imageUrl: "/services/warn.png"
    },
    {
        serviceName: "Infrastructure Monitoring",
        serviceDescription: "Description for Infrastructure Monitoring",
        imageUrl: "/services/infra.webp"
    },
    {
        serviceName: "Data Analytics",
        serviceDescription: "Description for Data Analytics",
        imageUrl: "/services/analytics.png"
    },
    {
        serviceName: "GIS consulting",
        serviceDescription: "Description for GIS consulting",
            imageUrl: "/services/giscons.jpeg"
    },
    {
        serviceName: "Remote Sensing",
        serviceDescription: "Description for Remote Sensing",
        imageUrl: "/services/remote-sensing.jpg"
    }

];