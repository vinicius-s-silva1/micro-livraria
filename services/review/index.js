
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Carrega o arquivo .proto
const reviewsProtoDefinition = protoLoader.loadSync('proto/review.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const reviewsPackageDefinition = grpc.loadPackageDefinition(reviewsProtoDefinition);

// Array para armazenar as avaliações
const reviewsData = [];

// Implementação do serviço
const server = new grpc.Server();

server.addService(reviewsPackageDefinition.ReviewService.service, {

    // Retorna as avaliações de um produto
    GetReviews: (call, callback) => {
        const productId = call.request.id;

        const productReviews = reviewsData.filter(
            (review) => review.productId == productId
        );

        callback(null, { reviews: productReviews });
    },

    // Adiciona uma nova avaliação
    AddReview: (call, callback) => {
        const review = call.request;

        // Adiciona a data atual
        review.date = new Date().toISOString();

        // Armazena a avaliação
        reviewsData.push(review);

        callback(null, {
            success: true,
            message: 'Avaliação adicionada com sucesso!',
        });
    },
});

// Inicia o servidor na porta 3003
server.bindAsync(
    '0.0.0.0:3003',
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
        if (error) {
            console.error(error);
            return;
        }

        console.log('Reviews Service running at http://127.0.0.1:3003');
    }
);