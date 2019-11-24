<Grid item key={track.id} xs={12} sm={6} md={4}>
<Card className={classes.card}>
  <CardHeader
    // avatar={<Avatar className={classes.avatar}>{data.user.username[0]}</Avatar>}
    avatar={
      <Avatar aria-label="recipe" className={classes.avatar}>
        R
      </Avatar>
    }
    title={
      <Link to={`/profile/${track.author.id}`}>
        {track.author.username}
      </Link>
    }
    subheader="September 14, 2016"
  />
  <CardMedia
    className={classes.media}
    image="/static/images/cards/paella.jpg"
    title="Paella dish"
  />
  <CardContent>
    <AudioPlayer url={track.url} />
  </CardContent>

  <CardActions disableSpacing>
    <IconButton aria-label="add to favorites">
      <FavoriteIcon />
    </IconButton>
    <IconButton aria-label="share">
      <ShareIcon />
    </IconButton>
    <IconButton
      className={clsx(classes.expand, {
        [classes.expandOpen]: expanded
      })}
      onClick={handleExpandClick}
      aria-expanded={expanded}
      aria-label="show more"
    >
      <MoreVertIcon />
    </IconButton>
  </CardActions>
  <Collapse in={expanded} timeout="auto" unmountOnExit>
    <CardContent>
      <p>{track.description}</p>
      {/* <DeleteTrack track={track} /> */}
      {/* <UpdateTrack track={track} /> */}
      <Typography paragraph>DeleteTrack</Typography>
      <Typography paragraph>UpdateTrack</Typography>
    </CardContent>
  </Collapse>
</Card>
</Grid>



<ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<MoreVertIcon />}>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </ExpansionPanelSummary>
              </ExpansionPanel>