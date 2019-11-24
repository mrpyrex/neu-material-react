import graphene
from graphene_django import DjangoObjectType
from .models import Track, Like
from graphql import GraphQLError
from users.schema import UserType
from django.db.models import Q


class TrackType(DjangoObjectType):
    class Meta:
        model = Track


class LikeType(DjangoObjectType):
    class Meta:
        model = Like


class Query(graphene.ObjectType):
    tracks = graphene.List(TrackType, search=graphene.String())
    likes = graphene.List(LikeType)

    def resolve_tracks(self, info, search=None):

        if search:
            filter = (
                Q(title__icontains=search) |
                Q(description__icontains=search) |
                Q(url__icontains=search) |
                Q(author__username__icontains=search)

            )
            return Track.objects.filter(filter)
        return Track.objects.all()

    def resolve_likes(self, info):
        return Like.objects.all()


class CreateTrack(graphene.Mutation):

    track = graphene.Field(TrackType)

    class Arguments:
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, **kwargs):
        author = info.context.user
        if author.is_anonymous:
            raise Exception("Login required")
        track = Track(**kwargs, author=author)
        track.save()
        return CreateTrack(track=track)


class UpdateTrack(graphene.Mutation):
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        url = graphene.String()

    def mutate(self, info, track_id, title, description, url):
        author = info.context.user
        track = Track.objects.get(id=track_id)

        if track.author != author:
            raise Exception("You are not allowed to edit this track")

        track.title = title
        track.description = description
        track.url = url

        track.save()

        return UpdateTrack(track=track)


class DeleteTrack(graphene.Mutation):
    track_id = graphene.Int()

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        author = info.context.user
        track = Track.objects.get(id=track_id)

        if track.author != author:
            raise Exception("You are not allowed to delete this track")

        track.delete()
        return DeleteTrack(track=track)


class CreateLike(graphene.Mutation):
    author = graphene.Field(UserType)
    track = graphene.Field(TrackType)

    class Arguments:
        track_id = graphene.Int(required=True)

    def mutate(self, info, track_id):
        author = info.context.user

        if author.is_anonymous:
            raise Exception("Login to like this track")

        track = Track.objects.get(id=track_id)

        if not track:
            raise Exception("No track with the provided query")

        Like.objects.create(
            author=author,
            track=track
        )

        return CreateLike(author=author, track=track)


class Mutation(graphene.ObjectType):
    create_track = CreateTrack.Field()
    update_track = UpdateTrack.Field()
    delete_track = DeleteTrack.Field()
    create_like = CreateLike.Field()
