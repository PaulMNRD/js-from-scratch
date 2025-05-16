export function check_collision(player, obstacle) {
    const player_rect = player.getBoundingClientRect();
    const obstacle_rect = obstacle.getBoundingClientRect();

    return !(
        player_rect.top > obstacle_rect.bottom ||
        player_rect.bottom < obstacle_rect.top ||
        player_rect.right < obstacle_rect.left ||
        player_rect.left > obstacle_rect.right
    )
}

export function check_collision_above(player, obstacle) {
    const player_rect = player.getBoundingClientRect();
    const obstacle_rect = obstacle.getBoundingClientRect();

    return player_rect.bottom <= obstacle_rect.bottom &&
        player_rect.bottom >= obstacle_rect.top &&
        player_rect.left <= obstacle_rect.right &&
        player_rect.right >= obstacle_rect.left
}